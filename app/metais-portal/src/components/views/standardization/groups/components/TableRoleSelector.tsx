import { MongoAbility } from '@casl/ability'
import { SimpleSelect, TextBody } from '@isdd/idsk-ui-kit/index'
import { GROUP_ROLES } from '@isdd/metais-common/constants'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import {
    IdentitiesInGroupAndCount,
    IdentityInGroupData,
    OperationResult,
    Role,
    useFindAll11Hook,
    useUpdateRoleOnGroupOrgForIdentityHook,
} from '@isdd/metais-common/src/api/generated/iam-swagger'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import { Row } from '@tanstack/react-table'
import React, { useState } from 'react'

import { TableData } from '@/components/containers/standardization/groups/GroupDetailContainer'
import { DEFAULT_KSISVS_ROLES, DEFAULT_ROLES } from '@/components/views/standardization/groups/defaultRoles'
import styles from '@/components/views/standardization/groups/styles.module.scss'

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
}

const GroupMemberTableRoleSelector: React.FC<GroupMemberTableRoleSelectorProps> = ({
    row,
    id,
    refetch,
    setIdentities,
    ability,
    setMembersUpdated,
    isKsisvs,
}) => {
    const findRoleRequest = useFindAll11Hook()
    const updateGroupRequest = useUpdateRoleOnGroupOrgForIdentityHook()

    const [isSelectorShown, setSelectorShown] = useState(false)
    const [selectedRole, setSelectedRole] = useState<string>(row.original.roleName)
    //check possible improvements after BE fix
    const handleGroupMemberChange = async (value: string | undefined) => {
        setSelectedRole(value ?? '')
        const oldRole: Role = (await findRoleRequest({ name: row.original.roleName })) as Role
        const newRole: Role = (await findRoleRequest({ name: value })) as Role
        await updateGroupRequest(row.original.uuid, id ?? '', oldRole.uuid ?? '', newRole.uuid ?? '', row.original.orgId)
        setSelectorShown(false)
        setMembersUpdated(true)
        const refetchData = await refetch()
        setIdentities(refetchData.data?.list)
    }

    if (isSelectorShown) {
        return (
            <SimpleSelect
                name="selectRole"
                value={selectedRole}
                onChange={handleGroupMemberChange}
                label=""
                options={(isKsisvs ? DEFAULT_KSISVS_ROLES : DEFAULT_ROLES).map((item) => ({
                    value: item.code,
                    label: item.value,
                }))}
            />
        )
    } else {
        return (row.original.roleName !== GROUP_ROLES.STD_PSPRE && ability.can(Actions.EDIT, 'groups')) ||
            (row.original.roleName === GROUP_ROLES.STD_PSPRE && ability.can(Actions.EDIT, 'groupMaster')) ? (
            <a
                className={styles.cursorPointer}
                onClick={() => {
                    setSelectorShown(true)
                }}
            >
                {
                    [...DEFAULT_KSISVS_ROLES, ...DEFAULT_ROLES].find((role) => {
                        return role.code == row.original.roleName
                    })?.value
                }
            </a>
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
}

export default GroupMemberTableRoleSelector
