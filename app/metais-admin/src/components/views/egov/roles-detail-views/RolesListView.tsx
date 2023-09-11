import { BreadCrumbs, Button, ButtonGroupRow, HomeIcon, Paginator, Table, TextHeading } from '@isdd/idsk-ui-kit'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { Role } from '@isdd/metais-common/api/generated/iam-swagger'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { ActionsOverTable, BASE_PAGE_SIZE, CreateEntityButton } from '@isdd/metais-common/index'
import { AdminRouteNames, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'

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
    const { t } = useTranslation()

    const columns: ColumnDef<Role>[] = [
        { technicalName: 'name', name: t('adminRolesPage.name') },
        { technicalName: 'description', name: t('adminRolesPage.description') },
        { technicalName: 'assignedGroup', name: t('adminRolesPage.group') },
        { technicalName: 'type', name: t('adminRolesPage.systemRole') },
    ].map((e) => ({ id: e.technicalName, header: e.name, accessorKey: e.technicalName, enableSorting: true, key: e.technicalName }))

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
            size: 210,
            cell: ({ cell }) => (
                <ButtonGroupRow key={cell.id}>
                    <Button
                        label={t('adminRolesPage.assignedUsers')}
                        variant="secondary"
                        onClick={() => navigate(AdminRouteNames.ROLE_USERS + '/' + cell.row.original.uuid, { state: { from: location } })}
                    />
                    <Button
                        label={t('adminRolesPage.edit')}
                        onClick={() => navigate(AdminRouteNames.ROLE_EDIT + '/' + cell.row.original.uuid, { state: { from: location } })}
                    />
                    <Button
                        label={t('adminRolesPage.deactivate')}
                        variant="warning"
                        onClick={() => {
                            setRoleToDelete(cell.row.original)
                        }}
                    />
                </ButtonGroupRow>
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
                links={[
                    { label: t('navbar.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('adminRolesPage.rolesList'), href: AdminRouteNames.ROLES },
                ]}
            />
            <TextHeading size="L">{t('adminRolesPage.rolesList')}</TextHeading>
            <RolesFilter tableRoleGroups={tableRoleGroups} />
            <ActionsOverTable
                entityName=""
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                handleFilterChange={myHandleFilterChange}
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
        </>
    )
}

export default RoleListView
