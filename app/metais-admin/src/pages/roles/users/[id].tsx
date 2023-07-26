import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFindRelatedIdentitiesWithPO } from '@isdd/metais-common/api/generated/iam-swagger'
import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { Filter } from '@isdd/idsk-ui-kit/filter'
import { BreadCrumbs, HomeIcon, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ColumnSort, SortType } from '@isdd/idsk-ui-kit/types'

interface RelatedIdentitiesTableData {
    name?: string
    login?: string
    email?: string
    obligedPerson?: string
}

interface FilterData extends IFilterParams {
    fullTextSearch: string
    obligedPerson: string
}

const defaultFilterValues: FilterData = {
    fullTextSearch: '',
    obligedPerson: '',
}

const RoleUsers: React.FC = () => {
    const { t } = useTranslation()
    const { id } = useParams()
    const { data, isLoading, isError } = useFindRelatedIdentitiesWithPO(id ?? '')

    const [tableData, setTableData] = useState<RelatedIdentitiesTableData[]>()
    const [filteredTableData, setFilteredTableData] = useState(tableData)
    const [obligedPersonList, setObligedPersonList] = useState<{ value: string; label: string }[]>()

    const [sort, setSort] = useState<ColumnSort[]>([{ sortDirection: SortType.ASC, orderBy: 'name' }])
    const { filter } = useFilterParams<FilterData>(defaultFilterValues)
    useEffect(() => {
        setTableData(
            data?.map((item) => ({
                name: item.lastName + '' + item.firstName,
                login: item.login,
                email: item.email,
                obligedPerson:
                    (item.attributes ?? {})['Gen_Profil_nazov'] +
                    ((item.attributes ?? {})['EA_Profil_PO_ulica'] ? ' - ' + (item.attributes ?? {})['EA_Profil_PO_ulica'] : '') +
                    ((item.attributes ?? {})['EA_Profil_PO_cislo'] ? ' - ' + (item.attributes ?? {})['EA_Profil_PO_cislo'] : '') +
                    ((item.attributes ?? {})['EA_Profil_PO_obec'] ? ' - ' + (item.attributes ?? {})['EA_Profil_PO_obec'] : '') +
                    ((item.attributes ?? {})['EA_Profil_PO_psc'] ? ' - ' + (item.attributes ?? {})['EA_Profil_PO_psc'] : ''),
            })) ?? [],
        )
    }, [data])

    useEffect(() => {
        const uniqueList = tableData
            ?.map((item) => item.obligedPerson ?? '')
            .filter((value, index, array) => array.indexOf(value) === index)
            .sort()
        setObligedPersonList(uniqueList?.map((item) => ({ value: item, label: item })))
    }, [tableData])

    useEffect(() => {
        setFilteredTableData(tableData)
    }, [tableData])

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
        console.log(filter.obligedPerson)

        setFilteredTableData(tableData?.filter((item) => item.obligedPerson?.includes(filter.obligedPerson ?? '')))
    }, [filter.obligedPerson, tableData])

    const columns: ColumnDef<RelatedIdentitiesTableData>[] = [
        { technicalName: 'name', name: t('adminRolesPage.fullName') },
        { technicalName: 'login', name: t('adminRolesPage.login') },
        { technicalName: 'email', name: t('adminRolesPage.email') },
        { technicalName: 'obligedPerson', name: t('adminRolesPage.obligedPerson') },
    ].map((e) => ({ id: e.technicalName, header: e.name, accessorKey: e.technicalName, enableSorting: true }))

    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('notifications.home'), href: '/', icon: HomeIcon },
                    { label: t('adminRolesPage.rolesList'), href: '/roles' },
                    { label: t('adminRolesPage.newRole'), href: '/roles/users/' + id },
                ]}
            />
            <TextHeading size="L">{t('adminRolesPage.assignedUsers')}</TextHeading>
            <Filter<FilterData>
                defaultFilterValues={defaultFilterValues}
                form={(register) => (
                    <div>
                        <SimpleSelect
                            {...register('obligedPerson')}
                            id="1"
                            label={t('adminRolesPage.obligedPerson')}
                            options={[{ value: '', label: t('adminRolesPage.all') }, ...(obligedPersonList ?? [])]}
                        />
                    </div>
                )}
            />
            <Table<RelatedIdentitiesTableData>
                onSortingChange={(newSort) => {
                    setSort(newSort)
                }}
                sort={sort}
                columns={columns}
                isLoading={isLoading}
                error={isError}
                data={filteredTableData}
            />
        </>
    )
}

export default RoleUsers
