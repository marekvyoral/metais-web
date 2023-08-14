import { ColumnSort, SortType } from '@isdd/idsk-ui-kit/types'
import { User, useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { QueryFeedback } from '@isdd/metais-common/index'
import {
    FindRelatedIdentitiesAndCountParams,
    IdentitiesInGroupAndCount,
    useFindRelatedIdentitiesAndCount,
} from '@isdd/metais-common/src/api/generated/iam-swagger'
import { ColumnDef } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DEFAULT_ROLES } from '../views/standartization/defaultRoles'

import { buildColumns, isUserAdmin } from '@/components/views/standartization/standartizationUtils'

const defaultSearch: FindRelatedIdentitiesAndCountParams = {
    orderBy: 'firstName_lastName',
    desc: false,
    identityState: 'ACTIVATED',
    page: '1',
    perPage: '10',
}

export interface TableData {
    uuid: string
    firstName_lastName: string
    organization: string
    orgId: string
    roleName: string
    email: string
}

const defaultSort: ColumnSort = {
    orderBy: 'firstName_lastName',
    sortDirection: SortType.ASC,
}

export interface FilterParams extends IFilterParams {
    memberUuid: string
    poUuid: string
    role: string
}

export const identitiesFilter: FilterParams = {
    memberUuid: '',
    poUuid: '',
    role: '',
}

export interface KSIVSViewProps {
    id?: string
    isAdmin: boolean
    identityToDelete: string | undefined
    setIdentityToDelete: React.Dispatch<React.SetStateAction<string | undefined>>
    isAddModalOpen: boolean
    setAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    successfulUpdatedData: boolean
    setSuccessfulUpdatedData: React.Dispatch<React.SetStateAction<boolean>>
    listParams: FindRelatedIdentitiesAndCountParams
    setListParams: React.Dispatch<React.SetStateAction<FindRelatedIdentitiesAndCountParams>>
    user: User | null
    rowSelection: Record<string, TableData>
    sorting: ColumnSort[]
    setSorting: React.Dispatch<React.SetStateAction<ColumnSort[]>>
    isIdentitiesLoading: boolean
    selectableColumnsSpec: ColumnDef<TableData>[]
    tableData: TableData[] | undefined
    identitiesData: IdentitiesInGroupAndCount | undefined
}

interface IKSIVSContainer {
    id?: string
    View: React.FC<KSIVSViewProps>
}

const KSIVSContainer: React.FC<IKSIVSContainer> = ({ id, View }) => {
    const {
        state: { user },
    } = useAuth()
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        setIsAdmin(isUserAdmin(user?.roles) ?? false)
    }, [user])
    const { t } = useTranslation()

    const [sorting, setSorting] = useState<ColumnSort[]>([defaultSort])
    const [listParams, setListParams] = useState(defaultSearch)
    const { filter } = useFilterParams<FilterParams>(identitiesFilter)

    const {
        data: identitiesData,
        isLoading: isIdentitiesLoading,
        isError: isIdentitesError,
    } = useFindRelatedIdentitiesAndCount(id ?? '', {
        ...listParams,
        ...(filter.memberUuid != undefined && { memberUuid: filter.memberUuid }),
        ...(filter.poUuid != undefined && { poUuid: filter.poUuid }),
        ...(filter.role != 'all' && filter.role != undefined && { role: filter.role }),
        ...(filter.fullTextSearch != undefined && { expression: filter.fullTextSearch }),
    })
    const [successfulUpdatedData, setSuccessfulUpdatedData] = useState(false)
    const columns: ColumnDef<TableData>[] = [
        { technicalName: 'firstName_lastName', name: t('KSIVSPage.name') },
        { technicalName: 'organization', name: t('KSIVSPage.organization') },
    ].map((e) => ({ id: e.technicalName, header: e.name, accessorKey: e.technicalName, enableSorting: true }))
    const [identities, setIdentities] = useState(identitiesData)
    const [tableData, setTableData] = useState<TableData[]>()
    useEffect(() => {
        setIdentities(identitiesData)
    }, [identitiesData])
    useEffect(() => {
        setTableData(
            identities?.list?.map((item) => ({
                uuid: item.identity?.uuid ?? '',
                firstName_lastName: item.identity?.lastName + ' ' + item.identity?.firstName,
                organization: item.gids?.map((org) => org.orgName)?.toString() ?? '',
                roleName:
                    (item.gids?.map((org) => org.roleName)?.filter((item1) => DEFAULT_ROLES.map((role) => role.description).includes(item1 ?? '')) ??
                        [])[0] ?? '',
                email: item.identity?.email ?? '',
                orgId: item.gids?.map((org) => org.orgId)?.toString() ?? '',
            })),
        )
    }, [identities])

    const [rowSelection, setRowSelection] = useState<Record<string, TableData>>({})

    const [identityToDelete, setIdentityToDelete] = useState<string>()
    const selectableColumnsSpec: ColumnDef<TableData>[] = buildColumns(
        rowSelection,
        setRowSelection,
        tableData,
        columns,
        user?.roles,
        t,
        id,
        listParams,
        filter,
        setIdentities,
        setIdentityToDelete,
    )

    const [isAddModalOpen, setAddModalOpen] = useState(false)

    return (
        <QueryFeedback loading={isIdentitiesLoading} error={isIdentitesError}>
            <View
                id={id}
                isAdmin={isAdmin}
                identityToDelete={identityToDelete}
                setIdentityToDelete={setIdentityToDelete}
                isAddModalOpen={isAddModalOpen}
                setAddModalOpen={setAddModalOpen}
                successfulUpdatedData={successfulUpdatedData}
                setSuccessfulUpdatedData={setSuccessfulUpdatedData}
                listParams={listParams}
                setListParams={setListParams}
                user={user}
                rowSelection={rowSelection}
                sorting={sorting}
                setSorting={setSorting}
                isIdentitiesLoading={isIdentitiesLoading}
                selectableColumnsSpec={selectableColumnsSpec}
                tableData={tableData}
                identitiesData={identitiesData}
            />
        </QueryFeedback>
    )
}

export default KSIVSContainer
