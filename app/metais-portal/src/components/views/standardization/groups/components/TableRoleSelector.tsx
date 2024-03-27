import { MongoAbility } from '@casl/ability'
import { SimpleSelect, TextBody } from '@isdd/idsk-ui-kit/index'
import { GROUP_ROLES } from '@isdd/metais-common/constants'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { IdentitiesInGroupAndCount, IdentityInGroupData, OperationResult } from '@isdd/metais-common/src/api/generated/iam-swagger'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import { Row } from '@tanstack/react-table'
import React from 'react'
import { GroupPermissionSubject } from '@isdd/metais-common/hooks/permissions/useGroupsPermissions'

import { TableData } from '@/components/containers/standardization/groups/GroupDetailContainer'
import { DEFAULT_KSISVS_ROLES, DEFAULT_ROLES } from '@/components/views/standardization/groups/defaultRoles'

interface GroupMemberTableRoleSelectorProps {
    row: Row<TableData>
    id?: string
    refetch: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
    ) => Promise<QueryObserverResult<IdentitiesInGroupAndCount, OperationResult>>
    setIdentities: (value: React.SetStateAction<IdentityInGroupData[] | undefined>) => void
    ability: MongoAbility
    setMembersUpdated: React.Dispatch<React.SetStateAction<boolean>>
    isKsisvs: boolean
    setUpdatingMember: React.Dispatch<React.SetStateAction<boolean>>
    setUpdatedMembers: React.Dispatch<
        React.SetStateAction<
            {
                uuid: string
                oldRole: string
                newRole: string
            }[]
        >
    >
    updatedMembers: {
        uuid: string
        oldRole: string
        newRole: string
    }[]
}

const GroupMemberTableRoleSelector: React.FC<GroupMemberTableRoleSelectorProps> = ({ row, ability, isKsisvs, setUpdatedMembers, updatedMembers }) => {
    const updatedMember = updatedMembers.find((o) => o.uuid === row.original.uuid)
    const selectedRole = updatedMember?.newRole ?? row.original.roleName

    //check possible improvements after BE fix
    const handleGroupMemberChange = async (value: string | undefined) => {
        setUpdatedMembers((prev) => {
            const newValues = prev.filter((o) => o.uuid !== row.original.uuid)
            return [...newValues, { uuid: row.original.uuid, oldRole: row.original.roleName, newRole: value ?? '' }]
        })
    }

    return (row.original.roleName !== GROUP_ROLES.STD_PSPRE && ability.can(Actions.EDIT, GroupPermissionSubject.GROUPS)) ||
        (row.original.roleName === GROUP_ROLES.STD_PSPRE && ability.can(Actions.EDIT, GroupPermissionSubject.GROUP_MASTER)) ? (
        <SimpleSelect
            name="selectRole"
            value={selectedRole}
            onChange={handleGroupMemberChange}
            isClearable={false}
            label=""
            options={(isKsisvs ? DEFAULT_KSISVS_ROLES : DEFAULT_ROLES).map((item) => ({
                value: item.code,
                label: item.value,
            }))}
        />
    ) : (
        <TextBody>
            {
                [...DEFAULT_KSISVS_ROLES, ...DEFAULT_ROLES].find((role) => {
                    return role.code == row.original.roleName
                })?.value
            }
        </TextBody>
    )
}

export default GroupMemberTableRoleSelector
