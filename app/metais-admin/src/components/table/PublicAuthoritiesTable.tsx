import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { ColumnDef } from '@tanstack/react-table'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME, ConfigurationItemSetUi, ConfigurationItemUi, FavoriteCiType } from '@isdd/metais-common/api'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { createFullAdressFromAttributes } from '@isdd/metais-common/componentHelpers/formatting/attributesCombinations'
import { CreateEntityButton } from '@isdd/metais-common/components/actions-over-table/actions-default/CreateEntityButton'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { MoreActionsOverRow } from '@/components/views/public-authorities/actions/MoreActionsOverRow'
import { IActions } from '@/components/containers/Egov/Entity/PublicAuthoritiesListContainer'

type PublicAuthoritiesTableProps = {
    data?: void | ConfigurationItemSetUi | undefined
    entityName?: string
    handleFilterChange: (filter: IFilter) => void
    storeUserSelectedColumns: (columnSelection: FavoriteCiType) => void
    resetUserSelectedColumns: () => Promise<void>
    pagination: Pagination
    sort: ColumnSort[]
    isLoading: boolean
    error?: boolean
}

export const PublicAuthoritiesTable = ({
    data,
    entityName,
    handleFilterChange,
    storeUserSelectedColumns,
    resetUserSelectedColumns,
    pagination,
    sort,
    isLoading,
    error,
    setInvalid,
}: PublicAuthoritiesTableProps & IActions) => {
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const columns: Array<ColumnDef<ConfigurationItemUi>> = [
        {
            header: t('table.name'),
            accessorFn: (row) => row?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
            enableSorting: true,
            id: 'name',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => (
                <Link to={'./' + ctx?.row.original.uuid} state={{ from: location }}>
                    {ctx?.getValue?.() as string}
                </Link>
            ),
        },
        {
            header: t('table.ico'),
            accessorFn: (row) => row?.attributes?.[ATTRIBUTE_NAME.EA_Profil_PO_ico],
            enableSorting: true,
            id: 'technicalName',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('table.adress'),
            accessorFn: (row) => createFullAdressFromAttributes(row.attributes),
            enableSorting: true,
            id: 'adress',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('actionsInTable.actions'),
            enableSorting: true,
            id: 'organizationsActions',
            cell: (ctx) => <MoreActionsOverRow setInvalid={setInvalid} ctx={ctx} />,
        },
    ]
    return (
        <div>
            <ActionsOverTable
                handleFilterChange={handleFilterChange}
                storeUserSelectedColumns={storeUserSelectedColumns}
                resetUserSelectedColumns={resetUserSelectedColumns}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                entityName={entityName ?? ''}
                createButton={
                    <CreateEntityButton
                        onClick={() => navigate(AdminRouteNames.PUBLIC_AUTHORITIES_FIND)}
                        label={t('publicAuthorities.create.addNewOrganization')}
                    />
                }
                // createHref="/organizations/find"
            />
            <Table data={data?.configurationItemSet} columns={columns} sort={sort} isLoading={isLoading} error={error} />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </div>
    )
}