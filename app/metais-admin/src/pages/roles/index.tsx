import React, { useEffect, useMemo, useState } from 'react'
import { Button, Filter, Table, TextHeading } from '@isdd/idsk-ui-kit'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useFindByNameWithParamsUsingGET, FindByNameWithParamsUsingGETParams, Role } from '@isdd/metais-common/api/generated/iam-swagger'
import { useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ColumnDef } from '@tanstack/react-table'

import styles from './roles.module.scss'
import { RoleType } from '@isdd/metais-common/api'

interface FilterData extends IFilterParams {
    name: string
    isSystemRole?: false
}

interface GroupRoles {
    value: string
    code: string
}

interface TableData {
    name: string
    description: string
    group: string
    isSystem: string
}

const defaultFilterValues: FilterData = {
    name: '',
    isSystemRole: false,
}

const ManageRoles: React.FC = () => {
    const { data: roleGroups } = useGetValidEnum('SKUPINA_ROL')
    console.log('ROLESGROPULOADED')

    const roleGroupsList: GroupRoles[] =
        roleGroups?.enumItems?.map((item) => ({
            value: item.value ?? '',
            code: item.code ?? '',
        })) ?? []

    const listRolesParams: FindByNameWithParamsUsingGETParams = {
        name: '',
        group: 'all',
        orderBy: 'name',
        direction: 'asc',
        system: '',
    }

    const findGroupName = (code: string | undefined) => {
        return roleGroupsList?.find((e) => e.code == code)?.value ?? 'Ziadna'
    }

    const columns = useMemo<ColumnDef<Role>[]>(() => {
        const list: ColumnDef<Role>[] = [
            { technicalName: 'name', name: 'Name' },
            { technicalName: 'description', name: 'Description' },
            { technicalName: 'assignedGroup', name: 'Group' },
            { technicalName: 'type', name: 'Systemova' },
        ].map((e) => ({ id: e.name, header: e.name, accessorKey: e.technicalName, enableSorting: true }))
        return list
    }, [])

    const SelectableColumnsSpec = (tableData?: Role[]): ColumnDef<Role>[] => [
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

    const { data: roles, isLoading, isError } = useFindByNameWithParamsUsingGET(1, 10, listRolesParams, { query: { enabled: !!roleGroups } })

    const [tableData, setTableData] = useState(roles)

    // setTableData(roles)

    // console.log(tableData?.map((e) => e.assignedGroup))
    console.log('Raw table data', tableData)

    useEffect(() => {
        tableData?.map((e) => (e.assignedGroup = findGroupName(e.assignedGroup)))
        console.log('MAPPED')
    }, [roleGroupsList])

    const showingData: TableData[] | undefined = tableData?.map((item) => ({
        name: item.name ?? '',
        description: item.description ?? '',
        group: findGroupName(item.assignedGroup),
        isSystem: item.type === RoleType.SYSTEM ? 'ano' : 'nie',
    }))

    console.log(tableData)

    return (
        <>
            <TextHeading size="L">Zoznam roli</TextHeading>
            <Filter<FilterData> form={(register) => <></>} defaultFilterValues={defaultFilterValues} />
            <Table<Role>
                onSortingChange={(newSort) => {
                    // setSort(newSort)
                    // clearSelectedRows()
                }}
                // sort={sort}
                columns={SelectableColumnsSpec(tableData)}
                isLoading={isLoading}
                error={isError}
                data={tableData}
            />
        </>
    )
}

export default ManageRoles
