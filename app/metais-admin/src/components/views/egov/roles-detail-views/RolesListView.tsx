import { BreadCrumbs, ButtonLink, ButtonPopup, HomeIcon, Paginator, Table, TextHeading } from '@isdd/idsk-ui-kit'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { Role } from '@isdd/metais-common/api/generated/iam-swagger'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { ActionsOverTable, BASE_PAGE_SIZE, CreateEntityButton, QueryFeedback } from '@isdd/metais-common/index'
import { AdminRouteNames, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { useLocation } from 'react-router-dom'

import styles from './roles.module.scss'

import { RoleListViewParams, defaultFilterValues } from '@/components/containers/Egov/Roles/RolesListContainer'
import { RolesFilter } from '@/components/views/egov/roles-detail-views/components/Rolesfilter'
import { DeleteRoleModal } from '@/components/views/egov/roles-detail-views/components/modal/DeleteModal'
import { MainContentWrapper } from '@/components/MainContentWrapper'

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

    const columns: ColumnDef<Role>[] = [
        {
            technicalName: 'name',
            name: t('adminRolesPage.name'),
            meta: {
                getCellContext: (ctx: CellContext<Role, unknown>) => ctx?.getValue?.(),
            },
        },
        {
            technicalName: 'description',
            name: t('adminRolesPage.description'),
            meta: {
                getCellContext: (ctx: CellContext<Role, unknown>) => ctx?.getValue?.(),
            },
        },
        {
            technicalName: 'assignedGroup',
            name: t('adminRolesPage.group'),
            meta: {
                getCellContext: (ctx: CellContext<Role, unknown>) => ctx?.getValue?.(),
            },
        },
        {
            technicalName: 'type',
            name: t('adminRolesPage.systemRole'),
            meta: {
                getCellContext: (ctx: CellContext<Role, unknown>) => ctx?.getValue?.(),
            },
        },
    ].map((e) => ({
        id: e.technicalName,
        header: e.name,
        accessorKey: e.technicalName,
        enableSorting: true,
        key: e.technicalName,
        meta: e.meta,
        size: 200,
    }))

    const { handleFilterChange } = useFilterParams(defaultFilterValues)
    const myHandleFilterChange = (myFilter: IFilter) => {
        handleFilterChange(myFilter)
        setPagination({ ...pagination, pageSize: myFilter.pageSize ?? BASE_PAGE_SIZE })
    }
    const SelectableColumnsSpec: ColumnDef<Role>[] = [
        ...columns,
        {
            id: 'edit',
            header: () => <></>,
            size: 200,
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
                        <TextHeading size="L">{t('adminRolesPage.rolesList')}</TextHeading>
                        {isError && <QueryFeedback error loading={false} />}
                    </FlexColumnReverseWrapper>
                    <RolesFilter tableRoleGroups={tableRoleGroups} />
                    <ActionsOverTable
                        pagination={{ ...pagination, dataLength: rolesPages ?? 0 }}
                        entityName=""
                        pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                        handleFilterChange={myHandleFilterChange}
                        createButton={
                            <CreateEntityButton
                                label={t('adminRolesPage.addNewRole')}
                                onClick={() => navigate(AdminRouteNames.ROLE_NEW, { state: { from: location } })}
                            />
                        }
                        hiddenButtons={{ SELECT_COLUMNS: true }}
                    />
                    <Table<Role>
                        onSortingChange={(newSort) => {
                            setSorting(newSort)
                        }}
                        sort={sorting}
                        columns={SelectableColumnsSpec}
                        isLoading={isLoading}
                        error={isError}
                        data={tableData}
                    />
                    <Paginator
                        dataLength={rolesPages ?? 0}
                        pageNumber={pagination.pageNumber}
                        pageSize={pagination.pageSize}
                        onPageChanged={(pageNumber) => setPagination({ ...pagination, pageNumber: pageNumber })}
                    />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}

export default RoleListView
