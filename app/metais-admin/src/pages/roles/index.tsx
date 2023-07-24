import React, { useEffect, useState } from 'react'
import { BreadCrumbs, Button, Filter, HomeIcon, Input, Paginator, SimpleSelect, Table, TextHeading } from '@isdd/idsk-ui-kit'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useFindByNameWithParams, Role, useFindByNameWithParamsCount, useDelete } from '@isdd/metais-common/api/generated/iam-swagger'
import { EnumItem, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ColumnDef } from '@tanstack/react-table'
import { ColumnSort, SortType } from '@isdd/idsk-ui-kit/types'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'

import styles from './roles.module.scss'

interface FilterData extends IFilterParams {
    name: string
    group: string
    system: string
}

interface Pagination {
    page: number
    pageSize: number
}

//Filter
const defaultFilterValues: FilterData = {
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

const findGroupName = (code: string | undefined, roleGroupsList: EnumItem[] | undefined) => {
    return roleGroupsList?.find((e) => e.code == code)?.value ?? 'Ziadna'
}

const ManageRoles: React.FC = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const { filter } = useFilterParams<FilterData>(defaultFilterValues)

    const [pagination, setPagination] = useState(defaultPagination)

    const [sorting, setSorting] = useState<ColumnSort[]>([defaultSort])

    //API Calls
    const { mutate: deleteRole } = useDelete()
    const { data: rolesPages } = useFindByNameWithParamsCount({ ...filter, name: filter.name ?? '' })
    const { data: roleGroups } = useGetValidEnum('SKUPINA_ROL')
    const {
        data: roles,
        isLoading,
        isError,
    } = useFindByNameWithParams(pagination.page, pagination.pageSize, {
        ...filter,
        name: filter.name ?? '',
        orderBy: sorting.length > 0 ? sorting[0].orderBy : 'name',
        direction: sorting.length > 0 ? sorting[0].sortDirection : 'asc',
    })

    const [tableRoleGroups, setTableRoleGroups] = useState(roleGroups)

    useEffect(() => {
        setTableRoleGroups(roleGroups)
    }, [roleGroups])

    const columns: ColumnDef<Role>[] = [
        { technicalName: 'name', name: 'name' },
        { technicalName: 'description', name: t('adminRolesPage.description') },
        { technicalName: 'assignedGroup', name: t('adminRolesPage.group') },
        { technicalName: 'type', name: t('adminRolesPage.systemRole') },
    ].map((e) => ({ id: e.name, header: e.name, accessorKey: e.technicalName, enableSorting: true }))

    const [tableRoles, setTableRoles] = useState(roles)
    const [tableData, setTableData] = useState(tableRoles)

    useEffect(() => {
        setTableRoles(roles)
    }, [roles])

    useEffect(() => {
        setTableData(tableRoles?.map((e) => ({ ...e, assignedGroup: findGroupName(e.assignedGroup, tableRoleGroups?.enumItems) })))
    }, [tableRoleGroups?.enumItems, tableRoles])

    const groups: { value: string; label: string }[] =
        tableRoleGroups?.enumItems?.map((item) => ({ value: item.code ?? '', label: item.value ?? '' })) ?? []

    const SelectableColumnsSpec = (): ColumnDef<Role>[] => [
        ...columns,
        {
            header: () => <></>,
            cell: ({ cell }) => (
                <>
                    <Button
                        label={t('adminRolesPage.assignedUsers')}
                        variant="secondary"
                        className={styles.widthFit}
                        onClick={() => navigate('/roles/users/' + cell.row.original.uuid)}
                    />
                </>
            ),
            accessorKey: 'assignedUsers',
        },
        {
            header: () => <></>,
            cell: ({ cell }) => (
                <>
                    <Button
                        label={t('adminRolesPage.edit')}
                        className={styles.widthFit}
                        onClick={() => navigate('/roles/edit/' + cell.row.original.uuid)}
                    />
                </>
            ),
            accessorKey: 'edit',
        },
        {
            header: () => <></>,
            cell: ({ cell }) => (
                <>
                    <Button
                        label={t('adminRolesPage.deactivate')}
                        variant="warning"
                        className={styles.widthFit}
                        onClick={() => deleteRole({ uuid: cell.row.original.uuid ?? '' })}
                    />
                </>
            ),
            accessorKey: 'delete',
        },
    ]

    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('notifications.home'), href: '/', icon: HomeIcon },
                    { label: t('adminRolesPage.rolesList'), href: '/roles' },
                ]}
            />
            <TextHeading size="L">{t('adminRolesPage.rolesList')}</TextHeading>
            <Filter<FilterData>
                form={(register) => (
                    <>
                        <SimpleSelect
                            {...register('group')}
                            id="1"
                            label={'Group'}
                            options={[{ value: 'all', label: t('adminRolesPage.all') }, ...groups]}
                        />
                        <SimpleSelect
                            {...register('system')}
                            id="1"
                            label={'System'}
                            options={[
                                { value: 'all', label: t('adminRolesPage.all') },
                                { value: 'SYSTEM', label: t('radioButton.yes') },
                                { value: 'NON_SYSTEM', label: t('radioButton.no') },
                            ]}
                        />
                        <Input {...register('name')} label={t('adminRolesPage.name')} />
                    </>
                )}
                defaultFilterValues={defaultFilterValues}
                heading={<></>}
            />
            <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                <Button label={t('adminRolesPage.addNewRole')} onClick={() => navigate('/roles/new')} />
            </div>
            <Table<Role>
                onSortingChange={(newSort) => {
                    setSorting(newSort)
                }}
                sort={sorting}
                columns={SelectableColumnsSpec()}
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
