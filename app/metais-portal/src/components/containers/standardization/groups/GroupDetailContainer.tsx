import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { KSIVS_SHORT_NAME, META_IS_TITLE } from '@isdd/metais-common/constants'
import { User, useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { AbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/index'
import {
    Group,
    IdentitiesInGroupAndCount,
    IdentityInGroupData,
    OperationResult,
    Role,
    useFindAll11Hook,
    useFindByUuid3,
    useFindRelatedIdentitiesAndCount,
    useUpdateRoleOnGroupOrgForIdentityHook,
} from '@isdd/metais-common/src/api/generated/iam-swagger'
import { ColumnDef, Row } from '@tanstack/react-table'
import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'

import { buildColumns } from '@/components/views/standardization/groups/groupMembersTableUtils'

export interface TableData {
    uuid: string
    lastName_firstName: string
    orgName: string
    orgId: string
    roleName: string
    email: string
}

export interface FilterParams extends IFilterParams, IFilter {
    memberUuid: string | undefined
    poUuid: string | undefined
    role: string | undefined
    identityState: string
}

export const defaultSort = [
    {
        orderBy: 'lastName_firstName',
        sortDirection: SortType.ASC,
    },
]

export const identitiesFilter: FilterParams = {
    memberUuid: undefined,
    poUuid: undefined,
    role: undefined,
    pageNumber: BASE_PAGE_NUMBER,
    pageSize: BASE_PAGE_SIZE,
    identityState: 'ACTIVATED',
    sort: defaultSort,
}

export interface GroupDetailViewProps {
    id?: string
    group: Group | undefined
    isAddModalOpen: boolean
    setAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    successfulUpdatedData: boolean
    setSuccessfulUpdatedData: React.Dispatch<React.SetStateAction<boolean>>
    user: User | null
    rowSelection: Record<string, TableData>
    isIdentitiesLoading: boolean
    selectableColumnsSpec: ColumnDef<TableData>[]
    tableData: TableData[] | undefined
    identitiesData: IdentitiesInGroupAndCount | undefined
    identityToDelete: string | undefined
    setIdentityToDelete: React.Dispatch<React.SetStateAction<string | undefined>>
    setMembersUpdated: React.Dispatch<React.SetStateAction<boolean>>
    handleFilterChange: (changedFilter: IFilter) => void
    filter: FilterParams
    isIdentitiesError: boolean
    error: OperationResult | null
    isLoading: boolean
}

interface GroupDetailContainer {
    id?: string
    View: React.FC<GroupDetailViewProps>
}

const GroupDetailContainer: React.FC<GroupDetailContainer> = ({ id, View }) => {
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user

    const ability = useContext(AbilityContext)

    const { t } = useTranslation()

    const { filter, handleFilterChange } = useFilterParams<FilterParams>(identitiesFilter)
    const { data: group, isLoading: isGroupLoading } = useFindByUuid3(id ?? '')

    const [rowSelection, setRowSelection] = useState<Record<string, TableData>>({})

    const [isAddModalOpen, setAddModalOpen] = useState(false)

    const [identities, setIdentities] = useState<IdentityInGroupData[]>()
    const {
        data: identitiesData,
        isLoading,
        isFetching,
        isError: isIdentitiesError,
        error,
        refetch,
    } = useFindRelatedIdentitiesAndCount(id ?? '', {
        page: String(filter.pageNumber),
        perPage: String(filter.pageSize),
        ...(filter.sort != undefined
            ? { orderBy: filter.sort[0].orderBy, desc: filter.sort[0].sortDirection === SortType.DESC }
            : { orderBy: defaultSort[0].orderBy, desc: defaultSort[0].sortDirection === SortType.DESC }),
        ...(filter.memberUuid != undefined && { memberUuid: filter.memberUuid }),
        ...(filter.identityState != undefined && { identityState: filter.identityState }),
        ...(filter.poUuid != undefined && { poUuid: filter.poUuid }),
        ...(filter.role != 'all' && filter.role != undefined && { role: filter.role }),
        ...(filter.fullTextSearch != undefined && { expression: filter.fullTextSearch }),
    })

    const [successfulUpdatedData, setSuccessfulUpdatedData] = useState(false)
    const [updatingMember, setUpdatingMember] = useState(false)

    const [tableData, setTableData] = useState<TableData[]>()
    const getRoleFromIdentityGids = (identity: IdentityInGroupData) => {
        return identity?.gids ? identity.gids[identity.gids.length - 1].roleName : ''
    }

    useEffect(() => {
        if (identities !== identitiesData) {
            setIdentities(identitiesData?.list)
        }
    }, [identities, identitiesData])

    useEffect(() => {
        setTableData(
            identities?.map((item) => ({
                uuid: item.identity?.uuid ?? '',
                lastName_firstName: item.identity?.lastName + ' ' + item.identity?.firstName,
                orgName: item.gids?.[item.gids.length - 1].orgName?.toString() ?? '',
                roleName: getRoleFromIdentityGids(item) ?? '',
                email: item.identity?.email ?? '',
                orgId: item.gids?.map((org) => org.orgId)?.toString() ?? '',
            })),
        )
    }, [identities])

    const [identityToDelete, setIdentityToDelete] = useState<string>()
    const [membersUpdated, setMembersUpdated] = useState(false)
    const [selectedRows, setSelectedRows] = useState<Array<number>>([])
    const [updatedMembers, setUpdatedMembers] = useState<Array<{ uuid: string; oldRole: string; newRole: string }>>([])
    const updateGroupRequest = useUpdateRoleOnGroupOrgForIdentityHook()
    const findRoleRequest = useFindAll11Hook()
    const { setIsActionSuccess, clearAction } = useActionSuccess()

    const handleSaveMemberRole = async (row: Row<TableData>) => {
        clearAction()
        const updatedMember = updatedMembers.find((o) => o.uuid === row.original.uuid)

        if (!updatedMember) {
            return
        }
        setUpdatingMember(true)

        const orgIds = row.original.orgId.split(',')
        const oldRole: Role = (await findRoleRequest({ name: updatedMember.oldRole })) as Role
        const newRole: Role = (await findRoleRequest({ name: updatedMember.newRole })) as Role

        await updateGroupRequest(row.original.uuid, id ?? '', oldRole.uuid ?? '', newRole.uuid ?? '', orgIds[orgIds.length - 1])

        setMembersUpdated(true)
        setUpdatingMember(false)
        const refetchData = await refetch()
        setIdentities(refetchData.data?.list)
        setIsActionSuccess({ value: true, path: `${NavigationSubRoutes.PRACOVNA_SKUPINA_DETAIL}/itvs`, additionalInfo: { type: 'memberUpdate' } })
    }

    const selectableColumnsSpec: ColumnDef<TableData>[] = buildColumns(
        rowSelection,
        setRowSelection,
        tableData,
        t,
        id,
        refetch,
        setIdentities,
        setIdentityToDelete,
        ability,
        setMembersUpdated,
        group?.shortName === KSIVS_SHORT_NAME,
        setUpdatingMember,
        selectedRows,
        setSelectedRows,
        setUpdatedMembers,
        updatedMembers,
        handleSaveMemberRole,
        isUserLogged,
    )

    useEffect(() => {
        if (id) {
            refetch()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, id, membersUpdated])

    document.title = `${t('titles.groupDetail')} ${group?.shortName ?? ''} ${META_IS_TITLE}`
    return (
        <View
            isIdentitiesError={isIdentitiesError}
            isLoading={[isLoading, isGroupLoading].some((item) => item)}
            error={error}
            filter={filter}
            handleFilterChange={handleFilterChange}
            id={id}
            group={group}
            isAddModalOpen={isAddModalOpen}
            setAddModalOpen={setAddModalOpen}
            successfulUpdatedData={successfulUpdatedData}
            setSuccessfulUpdatedData={setSuccessfulUpdatedData}
            user={user}
            rowSelection={rowSelection}
            isIdentitiesLoading={[isLoading, isFetching, updatingMember].some((item) => item)}
            selectableColumnsSpec={selectableColumnsSpec}
            tableData={tableData}
            identitiesData={identitiesData}
            identityToDelete={identityToDelete}
            setIdentityToDelete={setIdentityToDelete}
            setMembersUpdated={setMembersUpdated}
        />
    )
}

export default GroupDetailContainer
