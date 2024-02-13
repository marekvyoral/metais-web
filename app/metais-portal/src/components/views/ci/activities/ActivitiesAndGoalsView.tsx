import { Filter, PaginatorWrapper, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ActionsOverTable, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { DEFAULT_PAGESIZE_OPTIONS, ENTITY_CIEL } from '@isdd/metais-common/constants'

import { IView, TableCols, defaultFilter } from '@/components/containers/ActivitiesAndGoalsListContainer'
import { CommitmentToComplyingWithGoals } from '@/components/commitment-to-complying-with-goals/CommitmentToComplyingWithGoals'

export const ActivitiesAndGoalsView: React.FC<IView> = ({
    tableData,
    isLoading,
    isError,
    handleFilterChange,
    isOwnerOfCi,
    relateItemToProject,
    filter,
    totaltems,
    invalidateItemRelationToProject,
    isInvalidated,
    ciType,
    ciItemData,
    canCreateGraph,
    isMutateLoading,
    isMutateSuccess,
    isMutateError,
    resetSuccess,
    resetError,
}) => {
    const { t } = useTranslation()
    const location = useLocation()

    const hasSomeCheckedTableItem = !!tableData?.some((item) => item.checked)

    const columns: Array<ColumnDef<TableCols>> = [
        {
            accessorFn: (row) => row?.attributes?.[`Profil_${ciType}_kategoria`],
            header: t(`${ciType}.target`),
            id: 'target',
            size: 100,
            enableSorting: true,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
        },
        {
            accessorFn: (row) => row?.attributes?.Gen_Profil_nazov,
            header: t(`${ciType}.name`),
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
            header: t(`${ciType}.description`),
            id: 'description',
            size: 100,
            enableSorting: true,
            meta: {
                getCellContext: (ctx) => ctx.getValue(),
            },
        },
        {
            accessorFn: (row) => row?.checked,
            header: t(`${ciType}.action`),
            id: 'activities.projectActivity',
            size: 80,
            cell: (row) => {
                const ci = row.getValue() as ConfigurationItemUi
                return (
                    <SimpleSelect
                        disabled={!isOwnerOfCi || isInvalidated || !canCreateGraph}
                        label={''}
                        name={'projectActivity'}
                        defaultValue={ci ? 'true' : 'false'}
                        options={[
                            { value: 'true', label: t('radioButton.yes'), disabled: !!ci },
                            { value: 'false', label: t('radioButton.no'), disabled: !ci },
                        ]}
                        onChange={async (newValue) => {
                            newValue == 'true'
                                ? relateItemToProject(row.cell.row.original.uuid)
                                : invalidateItemRelationToProject(row.cell.row.original.uuid, row.cell.row.original.relationUuid)
                        }}
                        isClearable={false}
                    />
                )
            },
        },
    ]

    return (
        <QueryFeedback loading={isLoading || isMutateLoading} error={isError} indicatorProps={{ layer: 'parent' }} withChildren>
            <MutationFeedback
                success={isMutateSuccess}
                showSupportEmail
                error={isMutateError ? t('feedback.mutationErrorMessage') : undefined}
                onMessageClose={() => {
                    resetSuccess()
                    resetError()
                }}
            />
            <ActionsOverTable
                pagination={{ pageNumber: filter.pageNumber, pageSize: filter.pageSize, dataLength: totaltems ?? 0 }}
                handleFilterChange={handleFilterChange}
                entityName="documents"
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                hiddenButtons={{ SELECT_COLUMNS: true }}
            />

            <Filter form={() => <></>} defaultFilterValues={defaultFilter} onlySearch />

            {ciType == ENTITY_CIEL && (
                <CommitmentToComplyingWithGoals
                    isOwner={!!isOwnerOfCi}
                    ciItemData={ciItemData}
                    isCiItemInvalidated={isInvalidated}
                    hasSomeCheckedTableItem={hasSomeCheckedTableItem}
                />
            )}

            <Table<TableCols>
                columns={columns}
                data={tableData}
                sort={filter.sort}
                onSortingChange={(columnSort) => {
                    handleFilterChange({ sort: columnSort })
                }}
                isLoading={isLoading || isMutateLoading}
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
