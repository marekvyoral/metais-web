import { ColumnSort, Pagination, SortType } from '@isdd/idsk-ui-kit/types'
import { EnumItem, EnumType, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Role, useFindByNameWithParams, useFindByNameWithParamsCount } from '@isdd/metais-common/api/generated/iam-swagger'
import { ALL_EVENT_TYPES, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, ROLES_GROUP } from '@isdd/metais-common/constants'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface FilterData extends IFilterParams {
    name: string
    group: string
    system: string
}

//Filter
export const defaultFilterValues: FilterData = {
    name: '',
    system: ALL_EVENT_TYPES,
    group: ALL_EVENT_TYPES,
}

//Sorting
const defaultSort: ColumnSort = {
    orderBy: 'name',
    sortDirection: SortType.ASC,
}

const findGroupName = (code: string | undefined, roleGroupsList: EnumItem[] | undefined, defaultString: string) => {
    return roleGroupsList?.find((e) => e.code == code)?.value ?? defaultString
}

export interface RoleListViewParams {
    isLoading: boolean
    isError: boolean
    rolesPages: number | undefined
    roleToDelete: Role | undefined
    setRoleToDelete: React.Dispatch<React.SetStateAction<Role | undefined>>
    setTableRoles: React.Dispatch<React.SetStateAction<Role[] | undefined>>
    pagination: Pagination
    setPagination: React.Dispatch<React.SetStateAction<Pagination>>
    sorting: ColumnSort[]
    setSorting: React.Dispatch<React.SetStateAction<ColumnSort[]>>
    filter: FilterData
    tableRoleGroups: EnumType | undefined
    tableData: Role[] | undefined
}

interface IRolesList {
    View: React.FC<RoleListViewParams>
}

const RoleListContainer: React.FC<IRolesList> = ({ View }) => {
    const { t } = useTranslation()
    const { currentPreferences } = useUserPreferences()
    const { filter } = useFilterParams<FilterData>(defaultFilterValues)

    //Pagination
    const defaultPagination: Pagination = {
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: Number(currentPreferences.defaultPerPage) || BASE_PAGE_SIZE,
        dataLength: 0,
    }

    const [pagination, setPagination] = useState(defaultPagination)

    useEffect(() => {
        if (currentPreferences.defaultPerPage && currentPreferences.defaultPerPage.length > 0)
            setPagination((prevPagination) => ({ ...prevPagination, pageSize: Number(currentPreferences.defaultPerPage) }))
    }, [currentPreferences.defaultPerPage])

    const [roleToDelete, setRoleToDelete] = useState<Role>()

    const [sorting, setSorting] = useState<ColumnSort[]>([defaultSort])

    const { data: rolesPages } = useFindByNameWithParamsCount({
        ...filter,
        name: filter.fullTextSearch ?? defaultFilterValues.name,
        system: filter.system ?? defaultFilterValues.system,
        group: filter.group ?? defaultFilterValues.group,
    })
    const { data: roleGroups } = useGetValidEnum(ROLES_GROUP)

    const {
        data: roles,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useFindByNameWithParams(pagination.pageNumber, pagination.pageSize, {
        name: filter.fullTextSearch ?? defaultFilterValues.name,
        system: filter.system ?? defaultFilterValues.system,
        group: filter.group ?? defaultFilterValues.group,
        orderBy: sorting.length > 0 ? sorting[0].orderBy : 'name',
        direction: sorting.length > 0 ? sorting[0].sortDirection.toLowerCase() : 'asc',
    })

    const [tableRoleGroups, setTableRoleGroups] = useState(roleGroups)
    const [tableRoles, setTableRoles] = useState(roles)
    useEffect(() => {
        setTableRoleGroups(roleGroups)
    }, [roleGroups])

    const [tableData, setTableData] = useState(tableRoles)

    useEffect(() => {
        setTableRoles(roles)
        refetch()
    }, [refetch, roles])

    useEffect(() => {
        if (pagination.dataLength == 0) {
            setPagination({ ...pagination, dataLength: rolesPages ?? 0 })
        }
    }, [rolesPages, pagination])

    useEffect(() => {
        setTableData(
            tableRoles?.map((e) => ({ ...e, assignedGroup: findGroupName(e.assignedGroup, tableRoleGroups?.enumItems, t('adminRolesPage.none')) })),
        )
    }, [tableRoleGroups?.enumItems, tableRoles, t])
    return (
        <View
            isError={isError}
            isLoading={isLoading || isFetching}
            filter={filter}
            tableRoleGroups={tableRoleGroups}
            tableData={tableData}
            rolesPages={rolesPages}
            roleToDelete={roleToDelete}
            setRoleToDelete={setRoleToDelete}
            setTableRoles={setTableRoles}
            setPagination={setPagination}
            pagination={pagination}
            setSorting={setSorting}
            sorting={sorting}
        />
    )
}

export default RoleListContainer
