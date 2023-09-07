import { BreadCrumbs, Filter, HomeIcon, SimpleSelect, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ColumnSort, SortType } from '@isdd/idsk-ui-kit/types'
import { AdminRouteNames, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ColumnDef } from '@tanstack/react-table'
import { ALL_EVENT_TYPES } from '@isdd/metais-common/constants'

import { FilterData, IRelatedIdentitiesTableData, IRoleUsersViewParams } from '@/components/containers/Egov/Roles/UsersContainer'
import { mapRelatedIdentities } from '@/components/views/egov/roles-detail-views/formUtils'

const defaultFilterValues: FilterData = {
    fullTextSearch: '',
    obligedPerson: ALL_EVENT_TYPES,
}

export const RoleUsersView: React.FC<IRoleUsersViewParams> = ({ roleId, data, isLoading, isError }) => {
    const { t } = useTranslation()

    const [tableData, setTableData] = useState<IRelatedIdentitiesTableData[]>()
    const [filteredTableData, setFilteredTableData] = useState(tableData)
    const [obligedPersonList, setObligedPersonList] = useState<{ value: string; label: string }[]>([])
    const { filter } = useFilterParams<FilterData>(defaultFilterValues)

    const [sort, setSort] = useState<ColumnSort[]>([{ sortDirection: SortType.ASC, orderBy: 'name' }])
    useEffect(() => {
        setTableData(mapRelatedIdentities(data))
    }, [data])
    useEffect(() => {
        if (obligedPersonList.length == 0 || obligedPersonList == undefined) {
            const uniqueList = tableData
                ?.map((item) => item.obligedPerson ?? '')
                .filter((value, index, array) => array.indexOf(value) === index)
                .sort()
            setObligedPersonList(uniqueList?.map((item) => ({ value: item, label: item })) ?? [])
        }
    }, [obligedPersonList, tableData])

    useEffect(() => {
        setFilteredTableData(
            tableData?.filter(
                (item) =>
                    item.name?.includes(filter.fullTextSearch.trim()) ||
                    item.login?.includes(filter.fullTextSearch.trim()) ||
                    item.email?.includes(filter.fullTextSearch.trim()) ||
                    item.obligedPerson?.includes(filter.fullTextSearch.trim()),
            ),
        )
    }, [filter.fullTextSearch, tableData])

    useEffect(() => {
        setFilteredTableData(
            tableData?.filter((item) => item.obligedPerson?.includes(filter.obligedPerson != ALL_EVENT_TYPES ? filter.obligedPerson : '')),
        )
    }, [filter.obligedPerson, tableData])

    const roleUsersTableColumns: ColumnDef<IRelatedIdentitiesTableData>[] = [
        { technicalName: 'name', name: t('adminRolesPage.fullName') },
        { technicalName: 'login', name: t('adminRolesPage.login') },
        { technicalName: 'email', name: t('adminRolesPage.email') },
        { technicalName: 'obligedPerson', name: t('adminRolesPage.obligedPerson') },
    ].map((e) => ({ id: e.technicalName, header: e.name, accessorKey: e.technicalName, enableSorting: true }))

    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('navbar.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('adminRolesPage.rolesList'), href: AdminRouteNames.ROLES },
                    { label: t('adminRolesPage.newRole'), href: AdminRouteNames.ROLE_USERS + '/' + roleId },
                ]}
            />
            <TextHeading size="L">{t('adminRolesPage.assignedUsers')}</TextHeading>
            <Filter<FilterData>
                defaultFilterValues={defaultFilterValues}
                form={({ filter: myFilter, setValue }) => (
                    <div>
                        {obligedPersonList.length && (
                            <SimpleSelect
                                defaultValue={myFilter.obligedPerson}
                                setValue={setValue}
                                id="obligedPerson"
                                name="obligedPerson"
                                label={t('adminRolesPage.obligedPerson')}
                                options={[{ value: ALL_EVENT_TYPES, label: t('adminRolesPage.all') }, ...obligedPersonList]}
                            />
                        )}
                    </div>
                )}
            />
            <Table<IRelatedIdentitiesTableData>
                onSortingChange={(newSort) => {
                    setSort(newSort)
                }}
                sort={sort}
                columns={roleUsersTableColumns}
                isLoading={isLoading}
                error={isError}
                data={filteredTableData}
            />
        </>
    )
}