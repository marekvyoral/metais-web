import { Filter, PaginatorWrapper, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ActionsOverTable, QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef } from '@tanstack/react-table'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { IView, TableCols, defaultFilter } from '@/components/containers/ActivitiesListContainer'

export const ActivitiesView: React.FC<IView> = ({
    activities,
    isLoading,
    isError,
    handleFilterChange,
    isOwnerOfCi,
    relateActivityToProject,
    filter,
    totaltems,
    invalidateRelationActivityToProject,
}) => {
    const { t } = useTranslation()
    const location = useLocation()

    const [rowSelection, setRowSelection] = useState({})

    const columns: Array<ColumnDef<TableCols>> = [
        {
            accessorFn: (row) => row?.attributes?.Profil_Aktivita_kategoria,
            header: t('activities.target'),
            id: 'target',
            size: 100,
            enableSorting: true,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
        },
        {
            accessorFn: (row) => row?.attributes?.Gen_Profil_nazov,
            header: t('activities.name'),
            id: 'name',
            size: 200,
            enableSorting: true,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => (
                <Link to={`${NavigationSubRoutes.AKTIVITA}/${ctx?.row.original.uuid}`} state={{ from: location }}>
                    {ctx?.getValue?.() as string}
                </Link>
            ),
        },
        {
            accessorFn: (row) => row?.attributes?.Gen_Profil_popis,
            header: t('activities.description'),
            id: 'description',
            size: 100,
            enableSorting: true,
            meta: {
                getCellContext: (ctx) => ctx.getValue(),
            },
        },
        {
            accessorFn: (row) => row?.checked,
            header: t('activities.projectActivity'),
            id: 'activities.projectActivity',
            size: 80,
            cell: (row) => {
                const ci = row.getValue() as ConfigurationItemUi
                return (
                    <SimpleSelect
                        disabled={!isOwnerOfCi}
                        label={''}
                        name={'projectActivity'}
                        defaultValue={ci ? 'true' : 'false'}
                        options={[
                            { value: 'true', label: t('radioButton.yes') },
                            { value: 'false', label: t('radioButton.no') },
                        ]}
                        onChange={async (newValue) => {
                            newValue == 'true'
                                ? relateActivityToProject(row.cell.row.original.uuid)
                                : invalidateRelationActivityToProject(row.cell.row.original.uuid, row.cell.row.original.relationUuid)
                        }}
                    />
                )
            },
        },
    ]
    return (
        <QueryFeedback loading={isLoading} error={isError} indicatorProps={{ layer: 'parent' }} withChildren>
            <ActionsOverTable
                handleFilterChange={handleFilterChange}
                entityName="documents"
                hiddenButtons={{ SELECT_COLUMNS: true, BULK_ACTIONS: Object.keys(rowSelection).length === 0 }}
            />

            <Filter form={() => <></>} defaultFilterValues={defaultFilter} onlySearch />
            <Table<TableCols>
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
                columns={columns}
                data={activities}
                sort={filter.sort}
                onSortingChange={(columnSort) => {
                    handleFilterChange({ sort: columnSort })
                }}
            />
            <PaginatorWrapper
                pageNumber={filter.pageNumber ?? BASE_PAGE_NUMBER}
                pageSize={filter.pageSize ?? BASE_PAGE_SIZE}
                dataLength={totaltems ?? 0}
                handlePageChange={handleFilterChange}
            />
        </QueryFeedback>
    )
}
