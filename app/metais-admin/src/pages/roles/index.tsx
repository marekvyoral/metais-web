import React, { useEffect, useMemo, useState } from 'react'
import { Button, Filter, Input, Paginator, SimpleSelect, Table, TextHeading } from '@isdd/idsk-ui-kit'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import {
    useFindByNameWithParamsUsingGET,
    FindByNameWithParamsUsingGETParams,
    Role,
    useFindByNameWithParamsCountUsingGET,
} from '@isdd/metais-common/api/generated/iam-swagger'
import { EnumItem, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ColumnDef } from '@tanstack/react-table'
// import { ColumnSort } from '@isdd/idsk-ui-kit/types/filter'

import styles from './roles.module.scss'
import { ColumnSort, SortType } from '@isdd/idsk-ui-kit/types'

interface FilterData extends IFilterParams {
    name: string
    group: string
    system: string
}

interface GroupRoles {
    value: string
    code: string
}

interface Pagination {
    page: number
    pageSize: number
}

const findGroupName = (code: string | undefined, roleGroupsList: EnumItem[] | undefined) => {
    return roleGroupsList?.find((e) => e.code == code)?.value ?? 'Ziadna'
}

const ManageRoles: React.FC = () => {
    const defaultFilterValues: FilterData = {
        name: '',
        system: '',
        group: 'all',
    }
    const { filter } = useFilterParams<FilterData>(defaultFilterValues)

    const defaultPagination: Pagination = {
        page: 1,
        pageSize: 10,
    }
    const [pagination, setPagination] = useState(defaultPagination)

    const defaultSort: ColumnSort = {
        orderBy: 'Name',
        sortDirection: SortType.ASC,
    }
    const [sorting, setSorting] = useState<ColumnSort[]>([defaultSort])

    const { data: rolesPages } = useFindByNameWithParamsCountUsingGET(filter)
    const { data: roleGroups } = useGetValidEnum('SKUPINA_ROL')
    const {
        data: roles,
        isLoading,
        isError,
    } = useFindByNameWithParamsUsingGET(pagination.page, pagination.pageSize, {
        ...filter,
        orderBy: sorting.length > 0 ? sorting[0].orderBy : 'Name',
        direction: sorting.length > 0 ? sorting[0].sortDirection : 'asc',
    })

    const [tableRoleGroups, setTableRoleGroups] = useState(roleGroups)

    useEffect(() => {
        setTableRoleGroups(roleGroups)
    }, [roleGroups])

    const columns = useMemo<ColumnDef<Role>[]>(() => {
        const list: ColumnDef<Role>[] = [
            { technicalName: 'name', name: 'Name' },
            { technicalName: 'description', name: 'Description' },
            { technicalName: 'assignedGroup', name: 'Group' },
            { technicalName: 'type', name: 'Systemova' },
        ].map((e) => ({ id: e.name, header: e.name, accessorKey: e.technicalName, enableSorting: true }))
        return list
    }, [])

    const SelectableColumnsSpec = (): ColumnDef<Role>[] => [
        ...columns,
        {
            header: ({ table }) => <></>,
            cell: ({ cell }) => (
                <>
                    <Button label="Priradeni pouzivatelia" variant="secondary" className={styles.widthFit} />
                </>
            ),
            accessorKey: 'assignedUsers',
        },
        {
            header: ({ table }) => <></>,
            cell: ({ cell }) => (
                <>
                    <Button label="Upravit'" className={styles.widthFit} />
                </>
            ),
            accessorKey: 'edit',
        },
        {
            header: ({ table }) => <></>,
            cell: ({ cell }) => (
                <>
                    <Button label="Zneplatnit'" variant="warning" className={styles.widthFit} />
                </>
            ),
            accessorKey: 'delete',
        },
    ]

    const [tableRoles, setTableRoles] = useState(roles)
    const [tableData, setTableData] = useState(tableRoles)

    useEffect(() => {
        setTableRoles(roles)
    }, [roles])
    useEffect(() => {
        setTableData(tableRoles?.map((e) => ({ ...e, assignedGroup: findGroupName(e.assignedGroup, tableRoleGroups?.enumItems) })))
    }, [tableRoles])

    const groups: { value: string; label: string }[] =
        tableRoleGroups?.enumItems?.map((item) => ({ value: item.code ?? '', label: item.value ?? '' })) ?? []

    return (
        <>
            <TextHeading size="L">Zoznam roli</TextHeading>
            <Filter<FilterData>
                form={(register) => (
                    <>
                        <SimpleSelect {...register('group')} id="1" label={'Group'} options={[{ value: 'all', label: 'Vsetky' }, ...groups]} />
                        <SimpleSelect
                            {...register('system')}
                            id="1"
                            label={'System'}
                            options={[
                                { value: 'all', label: 'Vsetky' },
                                { value: 'SYSTEM', label: 'Ano' },
                                { value: 'NON_SYSTEM', label: 'Nie' },
                            ]}
                        />
                        <Input {...register('name')} label="Nazov" />
                    </>
                )}
                defaultFilterValues={defaultFilterValues}
                heading={<></>}
            />
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
