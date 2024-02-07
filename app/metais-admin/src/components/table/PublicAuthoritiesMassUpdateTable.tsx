import { ButtonLink, CheckBox, ExpandableRowCellWrapper } from '@isdd/idsk-ui-kit/index'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ConfigurationItemSetUi as CmdbConfigurationItemSetUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ConfigurationItemSetUi, ConfigurationItemUi } from '@isdd/metais-common/api/generated/iam-swagger'
import { reduceTableDataToObject } from '@isdd/metais-common/componentHelpers/table'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { BulkPopup } from '@isdd/metais-common/index'
import { ColumnDef, ExpandedState, Table as ITable, Row } from '@tanstack/react-table'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Attribute, AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'

import { IActions } from '@/components/containers/Egov/Entity/PublicAuthoritiesListContainer'
import OrganizationUpdateItemView from '@/components/views/public-authorities/PublicAuthoritiesUpdateItemView'
import { ActionsUpdateOverRow } from '@/components/views/public-authorities/actions/ActionsUpdateOverRow'
import { ColumnsOutputDefinition, PublicAuthoritiesMassUpdateFilterData } from '@/pages/public-authorities/mass-update'
import { PublicAuthorityStateEnum } from '@/components/filters/PublicAuthoritiesMassUpdateFilter'

export interface IRowSelectionState {
    rowSelection: Record<string, ColumnsOutputDefinition>
    setRowSelection: React.Dispatch<React.SetStateAction<Record<string, ColumnsOutputDefinition>>>
}

type PublicAuthoritiesMassUpdateTableProps = {
    data?: ConfigurationItemSetUi
    ciData?: CmdbConfigurationItemSetUi
    entityName?: string
    defaultFilterValues: PublicAuthoritiesMassUpdateFilterData
    handleFilterChange: (filter: IFilter) => void
    onApprove: (uuid: string[]) => void
    onReject: (uuid: string[]) => void
    pagination: Pagination
    attributeProfiles?: AttributeProfile[]
    attributes?: Attribute[]
    unitsData: EnumType | undefined
    constraintsData?: (EnumType | undefined)[]
    sort: ColumnSort[]
    isLoading: boolean
    error?: boolean
}

export const PublicAuthoritiesMassUpdateTable = ({
    ciData,
    data,
    entityName,
    handleFilterChange,
    onApprove,
    onReject,
    attributes,
    attributeProfiles,
    constraintsData,
    unitsData,
    pagination,
    sort,
    isLoading,
    error,
    defaultFilterValues,
}: PublicAuthoritiesMassUpdateTableProps & IActions) => {
    const { t } = useTranslation()

    const [rowSelection, setRowSelection] = useState<Record<string, ColumnsOutputDefinition>>({})

    const [expanded, setExpanded] = useState<ExpandedState>({})

    const { filter } = useFilterParams<PublicAuthoritiesMassUpdateFilterData>(defaultFilterValues)

    const selectedUuids = useMemo(() => {
        return Object.values(rowSelection).map((i) => i.metaAttributes?.owner || '')
    }, [rowSelection])

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

    const clearSelectedRows = useCallback(() => setRowSelection({}), [setRowSelection])

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

    const columns: Array<ColumnDef<ConfigurationItemUi>> = [
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
                                handleAllCheckboxChange(data?.configurationItemSet || [])
                            }}
                            onClick={(event) => event.stopPropagation()}
                            checked={checked}
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
                        checked={row.original.uuid ? !!rowSelection[row.original.uuid] : false}
                    />
                </div>
            ),
        },
        {
            header: t('table.name'),
            accessorFn: (row) => {
                return row?.attributes?.find((i) => i.name === ATTRIBUTE_NAME.Gen_Profil_nazov)?.value
            },
            enableSorting: false,
            id: 'name',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => <ExpandableRowCellWrapper row={ctx.row}>{ctx?.getValue?.() as string}</ExpandableRowCellWrapper>,
        },
        {
            header: t('table.ico'),
            accessorFn: (row) => {
                return row?.attributes?.find((i) => i.name === ATTRIBUTE_NAME.EA_Profil_PO_ico)?.value
            },
            enableSorting: false,
            id: 'ico',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('table.valid'),
            accessorFn: (row) => row?.metaAttributes?.state,
            enableSorting: false,
            id: 'state',
            meta: {
                getCellContext: (ctx) => {
                    t(`publicAuthorities.massUpdate.stateEnum.${ctx.getValue()}`)
                },
            },
            cell: (ctx) => <span>{t(`publicAuthorities.massUpdate.stateEnum.${ctx.getValue()}`)}</span>,
        },
        {
            header: t('actionsInTable.actions'),
            enableSorting: false,
            id: 'organizationsActions',
            cell: (ctx) =>
                ctx?.row.original.metaAttributes?.state === 'NEW' && (
                    <ActionsUpdateOverRow ctx={ctx} onApprove={(uuid) => onApprove([uuid])} onReject={(uuid) => onReject([uuid])} />
                ),
        },
    ]

    const getCurrentRowData = (uuid: string | undefined, actualData: CmdbConfigurationItemSetUi | undefined) => {
        return actualData?.configurationItemSet?.find((i) => i.uuid === uuid)
    }

    const disabledBulkAction = !selectedUuids.length || filter?.state !== PublicAuthorityStateEnum.NEW

    return (
        <div>
            <ActionsOverTable
                pagination={pagination}
                handleFilterChange={handleFilterChange}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                entityName={entityName ?? ''}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                bulkPopup={
                    <BulkPopup
                        checkedRowItems={selectedUuids.length}
                        disabled={disabledBulkAction}
                        items={(closePopup) => [
                            <ButtonLink
                                key={'approve'}
                                label={t('publicAuthorities.massUpdate.actions.approve')}
                                onClick={() => {
                                    onApprove(selectedUuids)
                                    setRowSelection({})
                                    closePopup()
                                }}
                            />,
                            <ButtonLink
                                key={'reject'}
                                label={t('publicAuthorities.massUpdate.actions.reject')}
                                onClick={() => {
                                    onReject(selectedUuids)
                                    setRowSelection({})
                                    closePopup()
                                }}
                            />,
                        ]}
                    />
                }
            />
            <Table
                data={data?.configurationItemSet}
                columns={columns}
                sort={sort}
                isLoading={isLoading}
                onSortingChange={(columnSort) => {
                    handleFilterChange({ sort: columnSort })
                    clearSelectedRows()
                }}
                error={error}
                expandedRowsState={expanded}
                onExpandedChange={setExpanded}
                isRowSelected={isRowSelected}
                getExpandedRow={(row) => {
                    return (
                        <OrganizationUpdateItemView
                            newData={row.original}
                            oldData={getCurrentRowData(row.original.uuid, ciData)}
                            constraintsData={constraintsData}
                            unitsData={unitsData}
                            attributes={attributes}
                            attributeProfiles={attributeProfiles}
                        />
                    )
                }}
            />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </div>
    )
}
