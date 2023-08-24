import { Table, TextBody } from '@isdd/idsk-ui-kit'
import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { MetainformationColumns } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { IListData } from '@isdd/metais-common/types/list'
import { CellContext, ColumnDef, Table as ITable, Row } from '@tanstack/react-table'
import classNames from 'classnames'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import styles from './ciTable.module.scss'
import {
    ColumnsOutputDefinition,
    getOwnerInformation,
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
    sort: ColumnSort[]
    rowSelectionState: IRowSelectionState
    isLoading: boolean
    isError: boolean
}

export const CiTable: React.FC<ICiTable> = ({ data, pagination, handleFilterChange, sort, rowSelectionState, isLoading, isError }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user

    const { rowSelection, setRowSelection } = rowSelectionState
    const schemaAttributes = reduceAttributesByTechnicalName(data?.entityStructure)
    const tableData = mapTableData(data.tableData, schemaAttributes, t, data.unitsData, data.constraintsData)
    const columnsAttributes = sortAndMergeCiColumns(data?.columnListData)

    const handleCheckboxChange = useCallback(
        (row: Row<ColumnsOutputDefinition>) => {
            if (row.original.uuid) {
                const newRowSelection = { ...rowSelection }
                if (rowSelection[row.original.uuid]) {
                    delete newRowSelection[row.original.uuid]
                } else {
                    newRowSelection[row.original.uuid] = row.original
                }
                setRowSelection(newRowSelection)
            }
        },
        [rowSelection, setRowSelection],
    )

    const handleAllCheckboxChange = useCallback(
        (rows: ColumnsOutputDefinition[]) => {
            const checked = rows.every(({ uuid }) => (uuid ? !!rowSelection[uuid] : false))
            const newRowSelection = { ...rowSelection }
            if (checked) {
                rows.forEach(({ uuid }) => uuid && delete newRowSelection[uuid])
                setRowSelection(newRowSelection)
            } else {
                setRowSelection((prevRowSelection) => ({ ...prevRowSelection, ...reduceTableDataToObject(rows) }))
            }
        },
        [rowSelection, setRowSelection],
    )

    const isRowSelected = useCallback(
        (row: Row<ColumnsOutputDefinition>) => {
            return row.original.uuid ? !!rowSelection[row.original.uuid] : false
        },
        [rowSelection],
    )

    const clearSelectedRows = useCallback(() => setRowSelection({}), [setRowSelection])

    const getColumnsFromApiCellContent = (index: number, ctx: CellContext<ColumnsOutputDefinition, unknown>, technicalName: string) => {
        const isFirstItem = index === 0
        const isInSchema = !!schemaAttributes[technicalName]?.name

        const isState = technicalName === MetainformationColumns.STATE
        const isOwner = technicalName === MetainformationColumns.OWNER
        const isDate = technicalName === MetainformationColumns.LAST_MODIFIED_AT || technicalName === MetainformationColumns.CREATED_AT

        switch (true) {
            case isFirstItem: {
                return (
                    <Link
                        to={'./' + ctx?.row?.original?.uuid}
                        className={classNames({ [styles.bold]: ctx?.row.original.uuid && !!rowSelection[ctx?.row.original.uuid] })}
                    >
                        {ctx?.getValue?.() as string}
                    </Link>
                )
            }
            case isInSchema: {
                return ctx.getValue() as string
            }
            case isState: {
                return t(`metaAttributes.state.${ctx.getValue()}`)
            }
            case isOwner: {
                return getOwnerInformation(ctx.getValue() as string, data.gestorsData)?.configurationItemUi?.attributes?.[
                    ATTRIBUTE_NAME.Gen_Profil_nazov
                ]
            }
            case isDate: {
                return t('dateTime', { date: ctx.getValue() as string })
            }
            default: {
                return ''
            }
        }
    }

    const columnsFromApi =
        columnsAttributes?.map((attribute, index) => {
            const technicalName = attribute.name === MetainformationColumns.GROUP ? MetainformationColumns.OWNER : attribute.name ?? ''
            const attributeHeader = schemaAttributes[technicalName]?.name ?? t(`ciType.meta.${technicalName}`)

            return {
                accessorFn: (row: ColumnsOutputDefinition) => row?.attributes?.[technicalName] ?? row?.metaAttributes?.[technicalName],
                header: () => <span className={classNames({ [styles.textUnderline]: index === 0 })}>{attributeHeader ?? technicalName}</span>,
                id: technicalName ?? '',
                size: 200,
                cell: (ctx: CellContext<ColumnsOutputDefinition, unknown>) => (
                    <TextBody size="S" className={'marginBottom0'}>
                        {getColumnsFromApiCellContent(index, ctx, technicalName)}
                    </TextBody>
                ),
                enableSorting: true,
            }
        }) ?? []

    const columns: Array<ColumnDef<ColumnsOutputDefinition>> = [
        ...(isUserLogged
            ? [
                  {
                      header: ({ table }: { table: ITable<ColumnsOutputDefinition> }) => {
                          const checked = table.getRowModel().rows.every((row) => (row.original.uuid ? !!rowSelection[row.original.uuid] : false))
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
                                  />
                              </div>
                          )
                      },
                      id: CHECKBOX_CELL,
                      cell: ({ row }: { row: Row<ColumnsOutputDefinition> }) => (
                          <div className="govuk-checkboxes govuk-checkboxes--small">
                              <CheckBox
                                  label=""
                                  name="checkbox"
                                  id={`checkbox_${row.id}`}
                                  value="true"
                                  onChange={(event) => {
                                      event.stopPropagation()
                                      handleCheckboxChange(row)
                                  }}
                                  onClick={(event) => event.stopPropagation()}
                                  checked={row.original.uuid ? !!rowSelection[row.original.uuid] : false}
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
                sort={sort}
                isRowSelected={isRowSelected}
                isLoading={isLoading}
                error={isError}
            />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </>
    )
}
