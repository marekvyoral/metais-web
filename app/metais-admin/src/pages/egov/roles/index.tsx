import { BreadCrumbs, Button, HomeIcon, Paginator, Table, TextHeading } from '@isdd/idsk-ui-kit'
import { ColumnSort, SortType } from '@isdd/idsk-ui-kit/types'
import { EnumItem, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Role, useFindByNameWithParams, useFindByNameWithParamsCount } from '@isdd/metais-common/api/generated/iam-swagger'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { AdminRouteNames, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { ROLES_GROUP } from '@isdd/metais-common/components/constants'

import styles from '@/components/views/egov/roles-detail-views/roles.module.scss'
import DeleteRoleModal from '@/components/views/egov/roles-detail-views/components/modal/DeleteModal'
import RolesFilter from '@/components/views/egov/roles-detail-views/components/Rolesfilter'
import RolesTableActions from '@/components/views/egov/roles-detail-views/components/ActionsOverTable'

export interface FilterData extends IFilterParams {
    name: string
    group: string
    system: string
}

export interface Pagination {
    page: number
    pageSize: number
}

//Filter
export const defaultFilterValues: FilterData = {
    name: '',
    system: 'all',
    group: 'all',
}

//Pagination
const defaultPagination: Pagination = {
    page: 1,
    pageSize: 10,
}

//Sorting
const defaultSort: ColumnSort = {
    orderBy: 'name',
    sortDirection: SortType.ASC,
}

const findGroupName = (code: string | undefined, roleGroupsList: EnumItem[] | undefined, defaultString: string) => {
    return roleGroupsList?.find((e) => e.code == code)?.value ?? defaultString
}

const ManageRoles: React.FC = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const { filter } = useFilterParams<FilterData>(defaultFilterValues)

    const [pagination, setPagination] = useState(defaultPagination)
    const [roleToDelete, setRoleToDelete] = useState<Role>()

    const [sorting, setSorting] = useState<ColumnSort[]>([defaultSort])

    const { data: rolesPages } = useFindByNameWithParamsCount({ ...filter, name: filter.fullTextSearch ?? '' })
    const { data: roleGroups } = useGetValidEnum(ROLES_GROUP)
    const {
        data: roles,
        isLoading,
        isError,
    } = useFindByNameWithParams(pagination.page, pagination.pageSize, {
        ...filter,
        name: filter.fullTextSearch ?? '',
        orderBy: sorting.length > 0 ? sorting[0].orderBy : 'name',
        direction: sorting.length > 0 ? sorting[0].sortDirection : 'asc',
    })

    const [tableRoleGroups, setTableRoleGroups] = useState(roleGroups)

    useEffect(() => {
        setTableRoleGroups(roleGroups)
    }, [roleGroups])

    const columns: ColumnDef<Role>[] = [
        { technicalName: 'name', name: t('adminRolesPage.name') },
        { technicalName: 'description', name: t('adminRolesPage.description') },
        { technicalName: 'assignedGroup', name: t('adminRolesPage.group') },
        { technicalName: 'type', name: t('adminRolesPage.systemRole') },
    ].map((e) => ({ id: e.technicalName, header: e.name, accessorKey: e.technicalName, enableSorting: true, key: e.technicalName }))

    const [tableRoles, setTableRoles] = useState(roles)
    const [tableData, setTableData] = useState(tableRoles)

    useEffect(() => {
        setTableRoles(roles)
    }, [roles])

    useEffect(() => {
        setTableData(
            tableRoles?.map((e) => ({ ...e, assignedGroup: findGroupName(e.assignedGroup, tableRoleGroups?.enumItems, t('adminRolesPage.none')) })),
        )
    }, [tableRoleGroups?.enumItems, tableRoles, t])

    const getSelectableColumnsSpec = (): ColumnDef<Role>[] => [
        ...columns,
        {
            id: 'assignedUsers',
            header: () => <></>,
            cell: ({ cell }) => (
                <>
                    <Button
                        key={cell.id}
                        label={t('adminRolesPage.assignedUsers')}
                        variant="secondary"
                        className={styles.widthFit}
                        onClick={() => navigate(AdminRouteNames.ROLE_USERS + '/' + cell.row.original.uuid)}
                    />
                </>
            ),
            accessorKey: 'assignedUsers',
        },
        {
            id: 'edit',
            header: () => <></>,
            cell: ({ cell }) => (
                <>
                    <Button
                        key={cell.id}
                        label={t('adminRolesPage.edit')}
                        className={styles.widthFit}
                        onClick={() => navigate(AdminRouteNames.ROLE_EDIT + '/' + cell.row.original.uuid)}
                    />
                </>
            ),
            accessorKey: 'edit',
        },
        {
            id: 'delete',
            header: () => <></>,
            cell: ({ cell }) => (
                <>
                    <Button
                        key={cell.id}
                        label={t('adminRolesPage.deactivate')}
                        variant="warning"
                        className={styles.widthFit}
                        onClick={() => {
                            setRoleToDelete(cell.row.original)
                        }}
                    />
                </>
            ),
            accessorKey: 'delete',
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
                    { label: t('notifications.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('adminRolesPage.rolesList'), href: AdminRouteNames.ROLES },
                ]}
            />
            <TextHeading size="L">{t('adminRolesPage.rolesList')}</TextHeading>
            <RolesFilter tableRoleGroups={tableRoleGroups} />
            <RolesTableActions pagination={pagination} setPagination={setPagination} />
            <Table<Role>
                onSortingChange={(newSort) => {
                    setSorting(newSort)
                }}
                sort={sorting}
                columns={getSelectableColumnsSpec()}
                isLoading={isLoading}
                error={isError}
                data={tableData}
            />
            <Paginator
                dataLength={rolesPages ?? 0}
                pageNumber={pagination.page}
                pageSize={pagination.pageSize}
                onPageChanged={(pageNumber) => setPagination({ ...pagination, page: pageNumber })}
            />
        </>
    )
}

export default ManageRoles
