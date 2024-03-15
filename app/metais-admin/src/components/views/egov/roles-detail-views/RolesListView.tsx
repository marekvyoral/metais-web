import { BreadCrumbs, ButtonLink, ButtonPopup, HomeIcon, ISelectColumnType, PaginatorWrapper, Table, TextHeading } from '@isdd/idsk-ui-kit'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { Role, RoleType } from '@isdd/metais-common/api/generated/iam-swagger'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { DEFAULT_PAGESIZE_OPTIONS, getRolesListSelectedColumns } from '@isdd/metais-common/constants'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ActionsOverTable, BASE_PAGE_NUMBER, CreateEntityButton, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { AdminRouteNames, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useLocation } from 'react-router-dom'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'

import styles from './roles.module.scss'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { RoleListViewParams, defaultFilterValues } from '@/components/containers/Egov/Roles/RolesListContainer'
import { RolesFilter } from '@/components/views/egov/roles-detail-views/components/Rolesfilter'
import { DeleteRoleModal } from '@/components/views/egov/roles-detail-views/components/modal/DeleteModal'

const RoleListView: React.FC<RoleListViewParams> = ({
    isLoading,
    isError,
    rolesPages,
    setRoleToDelete,
    roleToDelete,
    setTableRoles,
    pagination,
    setPagination,
    filter,
    sorting,
    setSorting,
    tableRoleGroups,
    tableData,
}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation()
    const [selectedColumns, setSelectedColumns] = useState<ISelectColumnType[]>(getRolesListSelectedColumns(t))
    const resetSelectedColumns = () => {
        setSelectedColumns(getRolesListSelectedColumns(t))
    }
    const { isActionSuccess } = useActionSuccess()
    const columns: ColumnDef<Role>[] = [
        {
            id: 'name',
            header: t('adminRolesPage.name'),
            accessorFn: (row) => row.name,
            meta: {
                getCellContext: (ctx: CellContext<Role, unknown>) => ctx?.getValue?.(),
            },
            enableSorting: true,
        },
        {
            id: 'description',
            size: 200,
            header: t('adminRolesPage.description'),
            accessorFn: (row) => row.description,
            meta: {
                getCellContext: (ctx: CellContext<Role, unknown>) => ctx?.getValue?.(),
            },
            enableSorting: true,
        },
        {
            id: 'assignedGroup',
            header: t('adminRolesPage.group'),
            accessorFn: (row) => row.assignedGroup,
            meta: {
                getCellContext: (ctx: CellContext<Role, unknown>) => ctx?.getValue?.(),
            },
            enableSorting: false,
        },
        {
            id: 'type',
            header: t('adminRolesPage.systemRole'),
            accessorFn: (row) => row.type,
            meta: {
                getCellContext: (ctx: CellContext<Role, unknown>) => ctx?.getValue?.(),
            },
            enableSorting: true,
        },
    ]

    const { handleFilterChange } = useFilterParams(defaultFilterValues)
    const myHandleFilterChange = (myFilter: IFilter) => {
        setPagination({
            dataLength: pagination.dataLength,
            pageNumber: myFilter.pageNumber ?? pagination.pageNumber,
            pageSize: myFilter.pageSize ?? pagination.pageSize,
        })
        handleFilterChange({ pageNumber: myFilter.pageNumber, pageSize: myFilter.pageSize })
    }

    const SelectableColumnsSpec: ColumnDef<Role>[] = [
        ...columns,
        {
            id: 'edit',
            header: () => <></>,
            cell: ({ cell }) => (
                <ButtonPopup
                    key={cell.id}
                    popupPosition="right"
                    buttonLabel={t('actionsInTable.moreActions')}
                    popupContent={(closePopup) => (
                        <div className={styles.buttonPopup}>
                            <ButtonLink
                                label={t('adminRolesPage.assignedUsers')}
                                type="button"
                                onClick={() => {
                                    navigate(AdminRouteNames.ROLE_USERS + '/' + cell.row.original.uuid, { state: { from: location } })
                                    closePopup()
                                }}
                            />
                            <ButtonLink
                                label={t('adminRolesPage.edit')}
                                type="button"
                                onClick={() => {
                                    navigate(AdminRouteNames.ROLE_EDIT + '/' + cell.row.original.uuid, { state: { from: location } })
                                    closePopup()
                                }}
                            />
                            <ButtonLink
                                label={t('adminRolesPage.deactivate')}
                                type="button"
                                onClick={() => {
                                    setRoleToDelete(cell.row.original)
                                    closePopup()
                                }}
                                disabled={cell.row.original.type === RoleType.SYSTEM}
                            />
                        </div>
                    )}
                />
            ),
            accessorKey: 'edit',
        },
    ]

    return (
        <>
            <DeleteRoleModal
                roleToDelete={roleToDelete}
                setTableRoles={setTableRoles}
                setRoleToDelete={setRoleToDelete}
                pagination={pagination}
                fetchParams={{
                    ...filter,
                    name: filter.fullTextSearch ?? '',
                    orderBy: sorting.length > 0 ? sorting[0].orderBy : 'name',
                    direction: sorting.length > 0 ? sorting[0].sortDirection : 'asc',
                }}
            />
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('navbar.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('adminRolesPage.rolesList'), href: AdminRouteNames.ROLES },
                ]}
            />
            <MainContentWrapper>
                <QueryFeedback loading={isLoading} error={false} withChildren>
                    <FlexColumnReverseWrapper>
                        <TextHeading size="XL">{t('adminRolesPage.rolesList')}</TextHeading>\
                        <QueryFeedback error={isError} loading={false} />
                        <MutationFeedback
                            success={isActionSuccess.value}
                            successMessage={
                                isActionSuccess.additionalInfo?.type === 'edit'
                                    ? t('mutationFeedback.successfulUpdated')
                                    : t('mutationFeedback.successfulCreated')
                            }
                        />
                    </FlexColumnReverseWrapper>
                    <RolesFilter tableRoleGroups={tableRoleGroups} />
                    <ActionsOverTable
                        pagination={{ ...pagination, dataLength: rolesPages ?? 0 }}
                        entityName=""
                        pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                        handleFilterChange={myHandleFilterChange}
                        simpleTableColumnsSelect={{ selectedColumns, saveSelectedColumns: setSelectedColumns, resetSelectedColumns }}
                        createButton={
                            <CreateEntityButton
                                label={t('adminRolesPage.addNewRole')}
                                onClick={() => navigate(AdminRouteNames.ROLE_NEW, { state: { from: location } })}
                            />
                        }
                    />
                    <Table<Role>
                        onSortingChange={(newSort) => {
                            setSorting(newSort)
                        }}
                        sort={sorting}
                        columns={
                            SelectableColumnsSpec.filter((c) =>
                                selectedColumns.find((s) => (s.selected && s.technicalName === c.id) || c.id == 'edit'),
                            ) ?? []
                        }
                        isLoading={isLoading}
                        error={isError}
                        data={tableData}
                    />
                    <PaginatorWrapper
                        dataLength={rolesPages ?? 0}
                        pageNumber={pagination.pageNumber}
                        pageSize={pagination.pageSize}
                        handlePageChange={(filterPage) => setPagination({ ...pagination, pageNumber: filterPage.pageNumber ?? BASE_PAGE_NUMBER })}
                    />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}

export default RoleListView
