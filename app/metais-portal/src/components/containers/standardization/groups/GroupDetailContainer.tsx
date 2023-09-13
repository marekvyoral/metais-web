import { ColumnSort, SortType } from '@isdd/idsk-ui-kit/types'
import { User, useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { AbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { QueryFeedback } from '@isdd/metais-common/index'
import {
    FindRelatedIdentitiesAndCountParams,
    Group,
    IdentitiesInGroupAndCount,
    IdentityInGroupData,
    useFindByUuid3,
    useFindRelatedIdentitiesAndCount,
    useFindRelatedIdentitiesAndCountHook,
} from '@isdd/metais-common/src/api/generated/iam-swagger'
import { ColumnDef } from '@tanstack/react-table'
import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, KSIVS_SHORT_NAME } from '@isdd/metais-common/constants'

import { buildColumns } from '@/components/views/standartization/groups/groupMembersTableUtils'

const defaultSearch: FindRelatedIdentitiesAndCountParams = {
    orderBy: 'firstName_lastName',
    desc: true,
    identityState: 'ACTIVATED',
    page: BASE_PAGE_NUMBER,
    perPage: BASE_PAGE_SIZE,
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
    memberUuid: string | undefined
    poUuid: string | undefined
    role: string | undefined
}

export const identitiesFilter: FilterParams = {
    memberUuid: undefined,
    poUuid: undefined,
    role: undefined,
}

export interface GroupDetailViewProps {
    id: string
    group: Group | undefined
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
    identityToDelete: string | undefined
    setIdentityToDelete: React.Dispatch<React.SetStateAction<string | undefined>>
    setMembersUpdated: React.Dispatch<React.SetStateAction<boolean>>
}

interface GroupDetailContainer {
    id: string
    View: React.FC<GroupDetailViewProps>
}

const GroupDetailContainer: React.FC<GroupDetailContainer> = ({ id, View }) => {
    const {
        state: { user },
    } = useAuth()
    const { groupId } = useParams()

    const ability = useContext(AbilityContext)

    const { t } = useTranslation()

    const [sorting, setSorting] = useState<ColumnSort[]>([defaultSort])
    const [listParams, setListParams] = useState(defaultSearch)
    const { filter } = useFilterParams<FilterParams>(identitiesFilter)

    const { data: group } = useFindByUuid3(groupId ?? '')

    const [rowSelection, setRowSelection] = useState<Record<string, TableData>>({})

    const [isAddModalOpen, setAddModalOpen] = useState(false)

    const loadIdentitiesHook = useFindRelatedIdentitiesAndCountHook()

    const [identities, setIdentities] = useState<IdentityInGroupData[]>()
    const [isIdentitiesLoading, setIsIdentitiesLoading] = useState(false)
    const {
        data: identitiesData,
        isLoading,
        isError: isIdentitiesError,
        error,
    } = useFindRelatedIdentitiesAndCount(id ?? '', {
        ...listParams,
        ...(filter.memberUuid != undefined && { memberUuid: filter.memberUuid }),
        ...(filter.poUuid != undefined && { poUuid: filter.poUuid }),
        ...(filter.role != 'all' && filter.role != undefined && { role: filter.role }),
        ...(filter.fullTextSearch != undefined && { expression: filter.fullTextSearch }),
    })

    const [successfulUpdatedData, setSuccessfulUpdatedData] = useState(false)

    const [tableData, setTableData] = useState<TableData[]>()

    const getRoleFromIdentityGids = (identity: IdentityInGroupData) => {
        return identity?.gids ? identity.gids[0].roleName : ''
    }

    useEffect(() => {
        setIsIdentitiesLoading(isLoading)
        setIdentities(identitiesData?.list)
    }, [identitiesData, isLoading])
    useEffect(() => {
        setTableData(
            identities?.map((item) => ({
                uuid: item.identity?.uuid ?? '',
                firstName_lastName: item.identity?.lastName + ' ' + item.identity?.firstName,
                organization: item.gids?.map((org) => org.orgName)?.toString() ?? '',
                roleName: getRoleFromIdentityGids(item) ?? '',
                email: item.identity?.email ?? '',
                orgId: item.gids?.map((org) => org.orgId)?.toString() ?? '',
            })),
        )
    }, [identities])

    const [identityToDelete, setIdentityToDelete] = useState<string>()
    const [membersUpdated, setMembersUpdated] = useState(false)

    const selectableColumnsSpec: ColumnDef<TableData>[] = buildColumns(
        rowSelection,
        setRowSelection,
        tableData,
        t,
        id,
        listParams,
        filter,
        setIdentities,
        setIdentityToDelete,
        ability,
        setMembersUpdated,
        group?.shortName === KSIVS_SHORT_NAME,
    )

    useEffect(() => {
        const loadIdentities = async () => {
            setIsIdentitiesLoading(true)
            await loadIdentitiesHook(id ?? '', {
                ...listParams,
                ...(filter.memberUuid != undefined && { memberUuid: filter.memberUuid }),
                ...(filter.poUuid != undefined && { poUuid: filter.poUuid }),
                ...(filter.role != 'all' && filter.role != undefined && { role: filter.role }),
                ...(filter.fullTextSearch != undefined && { expression: filter.fullTextSearch }),
            }).then((res) => {
                setIdentities(res.list)
                setIsIdentitiesLoading(false)
                setMembersUpdated(false)
            })
        }
        if (membersUpdated) {
            loadIdentities()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter.fullTextSearch, filter.memberUuid, filter.poUuid, filter.role, id, listParams, membersUpdated])

    return (
        <QueryFeedback loading={false} error={isIdentitiesError} errorProps={{ errorMessage: error?.message, errorTitle: error?.type }}>
            <View
                id={id}
                group={group}
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
                identityToDelete={identityToDelete}
                setIdentityToDelete={setIdentityToDelete}
                setMembersUpdated={setMembersUpdated}
            />
        </QueryFeedback>
    )
}

export default GroupDetailContainer
