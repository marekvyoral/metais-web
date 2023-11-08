import { Table, TextBody } from '@isdd/idsk-ui-kit'
import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { MetainformationColumns } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { IListData } from '@isdd/metais-common/types/list'
import { CellContext, ColumnDef, ColumnOrderState, Table as ITable, Row, Updater } from '@tanstack/react-table'
import classNames from 'classnames'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { setEnglishLangForAttr } from '@isdd/metais-common/componentHelpers/englishAttributeLang'
import { HTML_TYPE, MUK } from '@isdd/metais-common/constants'
import { SafeHtmlComponent } from '@isdd/idsk-ui-kit/save-html-component/SafeHtmlComponent'

import styles from './ciTable.module.scss'
import {
    ColumnsOutputDefinition,
    IStoreColumnSelection,
    getOrderCiColumns,
    getOwnerInformation,
    isMetaAttribute,
    mapTableData,
    reduceAttributesByTechnicalName,
    reduceTableDataToObject,
    sortAndMergeCiColumns,
} from './ciTableHelpers'

export interface IRowSelectionState {
    rowSelection: Record<string, ColumnsOutputDefinition>
    setRowSelection: React.Dispatch<React.SetStateAction<Record<string, ColumnsOutputDefinition>>>
}

interface ICiTable {
    data: IListData
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    storeUserSelectedColumns?: (columnSelection: IStoreColumnSelection) => void
    sort: ColumnSort[]
    isLoading: boolean
    isError: boolean
    rowSelectionState?: IRowSelectionState
    uuidsToMatchedCiItemsMap?: Record<string, Record<string, ConfigurationItemUi>>
}

export const CiTable: React.FC<ICiTable> = ({
    data,
    pagination,
    handleFilterChange,
    storeUserSelectedColumns,
    sort,
    isLoading,
    isError,
    rowSelectionState,
    uuidsToMatchedCiItemsMap,
}) => {
    const { t } = useTranslation()

    const { userInfo: user } = useAuth()
    const isUserLogged = !!user
    const location = useLocation()
    const schemaAttributes = reduceAttributesByTechnicalName(data?.entityStructure)
    const tableData = mapTableData(
        data.tableData?.configurationItemSet,
        schemaAttributes,
        t,
        data.unitsData,
        data.constraintsData,
        uuidsToMatchedCiItemsMap,
    )
    const columnsAttributes = sortAndMergeCiColumns(data?.columnListData)

    const handleCheckboxChange = useCallback(
        (row: Row<ColumnsOutputDefinition>) => {
            if (row.original.uuid && rowSelectionState) {
                const { rowSelection, setRowSelection } = rowSelectionState
                const newRowSelection = { ...rowSelection }
                if (rowSelection[row.original.uuid]) {
                    delete newRowSelection[row.original.uuid]
                } else {
                    newRowSelection[row.original.uuid] = row.original
                }
                setRowSelection(newRowSelection)
            }
        },
        [rowSelectionState],
    )

    const handleAllCheckboxChange = useCallback(
        (rows: ColumnsOutputDefinition[]) => {
            if (rowSelectionState) {
                const { rowSelection, setRowSelection } = rowSelectionState
                const checked = rows.every(({ uuid }) => (uuid ? !!rowSelection[uuid] : false))
                const newRowSelection = { ...rowSelection }
                if (checked) {
                    rows.forEach(({ uuid }) => uuid && delete newRowSelection[uuid])
                    setRowSelection(newRowSelection)
                } else {
                    setRowSelection((prevRowSelection) => ({ ...prevRowSelection, ...reduceTableDataToObject(rows) }))
                }
            }
        },
        [rowSelectionState],
    )

    const isRowSelected = useCallback(
        (row: Row<ColumnsOutputDefinition>) => {
            return row.original.uuid && rowSelectionState ? !!rowSelectionState?.rowSelection[row.original.uuid] : false
        },
        [rowSelectionState],
    )

    const clearSelectedRows = useCallback(() => {
        rowSelectionState?.setRowSelection({})
    }, [rowSelectionState])

    const getColumnsFromApiCellContent = (index: number, ctx: CellContext<ColumnsOutputDefinition, unknown>, technicalName: string) => {
        const isFirstItem = index === 0
        const isInSchema = !!schemaAttributes[technicalName]?.name

        const isMUK = technicalName === MUK
        const isState = technicalName === MetainformationColumns.STATE
        const isOwner = technicalName === MetainformationColumns.OWNER
        const isDate = technicalName === MetainformationColumns.LAST_MODIFIED_AT || technicalName === MetainformationColumns.CREATED_AT
        const isHTML = schemaAttributes?.[technicalName]?.type === HTML_TYPE

        switch (true) {
            case isFirstItem: {
                return (
                    <Link
                        to={'./' + ctx?.row?.original?.uuid}
                        state={{ from: location }}
                        className={classNames({ [styles.bold]: ctx?.row.original.uuid && !!rowSelectionState?.rowSelection[ctx?.row.original.uuid] })}
                    >
                        {ctx?.getValue?.() as string}
                    </Link>
                )
            }
            case isState: {
                return t(`metaAttributes.state.${ctx.getValue()}`)
            }
            case isMUK: {
                return t(`refRegisters.table.muk.${ctx.getValue()}`)
            }
            case isOwner: {
                return getOwnerInformation(ctx?.row?.original?.metaAttributes?.owner as string, data.gestorsData)?.configurationItemUi?.attributes?.[
                    ATTRIBUTE_NAME.Gen_Profil_nazov
                ]
            }
            case isDate: {
                return t('dateTime', { date: ctx.getValue() as string })
            }
            case isHTML: {
                return <SafeHtmlComponent dirtyHtml={ctx?.getValue?.() as string} />
            }
            case isInSchema: {
                return ctx.getValue() as string
            }
            default: {
                return ''
            }
        }
    }

    const columnsFromApi =
        columnsAttributes?.map((attribute, index) => {
            const technicalName = attribute.name ?? ''
            const attributeHeader = isMetaAttribute(technicalName) ? t(`ciType.meta.${technicalName}`) : schemaAttributes[technicalName]?.name

            return {
                accessorFn: (row: ColumnsOutputDefinition) => row?.attributes?.[technicalName] ?? row?.metaAttributes?.[technicalName],
                header: () => <span>{attributeHeader ?? technicalName}</span>,
                id: technicalName ?? '',
                size: index === 0 ? 300 : 200,
                cell: (ctx: CellContext<ColumnsOutputDefinition, unknown>) => (
                    <TextBody lang={setEnglishLangForAttr(technicalName ?? '')} size="S" className={'marginBottom0'}>
                        {getColumnsFromApiCellContent(index, ctx, technicalName)}
                    </TextBody>
                ),
                meta: {
                    getCellContext: (ctx: CellContext<ColumnsOutputDefinition, unknown>) => getColumnsFromApiCellContent(index, ctx, technicalName),
                },
                enableSorting: true,
            }
        }) ?? []

    const columns: Array<ColumnDef<ColumnsOutputDefinition>> = [
        ...(isUserLogged && rowSelectionState?.rowSelection
            ? [
                  {
                      header: ({ table }: { table: ITable<ColumnsOutputDefinition> }) => {
                          const checked = table
                              .getRowModel()
                              .rows.every((row) => (row.original.uuid ? !!rowSelectionState?.rowSelection[row.original.uuid] : false))
                          return (
                              <div className="govuk-checkboxes govuk-checkboxes--small">
                                  <CheckBox
                                      label=""
                                      name="checkbox"
                                      id="checkbox-all"
                                      value="checkbox-all"
                                      onChange={(event) => {
                                          event.stopPropagation()
                                          handleAllCheckboxChange(tableData)
                                      }}
                                      onClick={(event) => event.stopPropagation()}
                                      checked={checked}
                                      containerClassName={styles.marginBottom15}
                                      title={t('table.selectAllItems')}
                                  />
                              </div>
                          )
                      },
                      id: CHECKBOX_CELL,
                      cell: ({ row }: { row: Row<ColumnsOutputDefinition> }) => (
                          <div className="govuk-checkboxes govuk-checkboxes--small">
                              <CheckBox
                                  label=""
                                  title={`checkbox_${row.id}`}
                                  name="checkbox"
                                  id={`checkbox_${row.id}`}
                                  value="true"
                                  onChange={(event) => {
                                      event.stopPropagation()
                                      handleCheckboxChange(row)
                                  }}
                                  onClick={(event) => event.stopPropagation()}
                                  checked={row.original.uuid ? !!rowSelectionState?.rowSelection[row.original.uuid] : false}
                                  containerClassName={styles.marginBottom15}
                              />
                          </div>
                      ),
                  },
              ]
            : []),
        ...columnsFromApi,
    ]

    return (
        <>
            <Table
                columns={columns}
                data={tableData}
                rowHref={(row) => `./${row?.original?.uuid}`}
                onSortingChange={(newSort) => {
                    handleFilterChange({ sort: newSort })
                    clearSelectedRows()
                }}
                onColumnOrderChange={(updaterOrValue: Updater<ColumnOrderState>) =>
                    storeUserSelectedColumns && storeUserSelectedColumns(getOrderCiColumns(data?.columnListData, updaterOrValue as ColumnOrderState))
                }
                canDrag={!!user}
                sort={sort}
                isRowSelected={isRowSelected}
                isLoading={isLoading}
                error={isError}
            />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </>
    )
}
