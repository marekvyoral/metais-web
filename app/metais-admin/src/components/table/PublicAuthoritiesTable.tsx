import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { ColumnDef } from '@tanstack/react-table'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { ConfigurationItemSetUi, ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { createFullAdressFromAttributes } from '@isdd/metais-common/componentHelpers/formatting/attributesCombinations'
import { CreateEntityButton } from '@isdd/metais-common/components/actions-over-table/actions-default/CreateEntityButton'
import { FavoriteCiType } from '@isdd/metais-common/api/generated/user-config-swagger'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useGetTopLevelPoUuid } from '@isdd/metais-common/hooks/useGetTopLevelPoUuid'

import { MoreActionsOverRow } from '@/components/views/public-authorities/actions/MoreActionsOverRow'
import { IActions } from '@/components/containers/Egov/Entity/PublicAuthoritiesListContainer'

type PublicAuthoritiesTableProps = {
    data?: void | ConfigurationItemSetUi
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
    const eGovGarant = useGetTopLevelPoUuid()
    const columns: Array<ColumnDef<ConfigurationItemUi>> = [
        {
            header: t('table.name'),
            accessorFn: (row) => row?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
            enableSorting: true,
            id: ATTRIBUTE_NAME.Gen_Profil_nazov,
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
            id: ATTRIBUTE_NAME.EA_Profil_PO_ico,
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
            cell: (ctx) =>
                ctx.row.original.metaAttributes?.state === 'DRAFT' ? (
                    <MoreActionsOverRow setInvalid={setInvalid} ctx={ctx} disableEdit={ctx.row.original.uuid === eGovGarant.uuid} />
                ) : (
                    <></>
                ),
        },
    ]
    return (
        <div>
            <ActionsOverTable
                pagination={pagination}
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
                hiddenButtons={{ SELECT_COLUMNS: true }}
            />
            <Table data={data?.configurationItemSet} columns={columns} sort={sort} isLoading={isLoading} error={error} />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </div>
    )
}
