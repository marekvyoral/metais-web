import { MongoAbility } from '@casl/ability'
import { SimpleSelect, TextBody } from '@isdd/idsk-ui-kit/index'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import {
    FindRelatedIdentitiesAndCountParams,
    IdentityInGroupData,
    Role,
    useFindAll11Hook,
    useFindRelatedIdentitiesAndCountHook,
    useUpdateRoleOnGroupOrgForIdentityHook,
} from '@isdd/metais-common/src/api/generated/iam-swagger'
import { Row } from '@tanstack/react-table'
import React, { useState } from 'react'
import { GROUP_ROLES } from '@isdd/metais-common/constants'

import { DEFAULT_KSISVS_ROLES, DEFAULT_ROLES } from '@/components/views/standartization/groups/defaultRoles'
import styles from '@/components/views/standartization/groups/styles.module.scss'
import { FilterParams, TableData } from '@/components/containers/standardization/groups/GroupDetailContainer'

interface GroupMemberTableRoleSelectorProps {
    row: Row<TableData>
    id?: string
    listParams: FindRelatedIdentitiesAndCountParams
    setIdentities: (value: React.SetStateAction<IdentityInGroupData[] | undefined>) => void
    filter: FilterParams
    ability: MongoAbility
    setMembersUpdated: React.Dispatch<React.SetStateAction<boolean>>
    isKsisvs: boolean
}

const GroupMemberTableRoleSelector: React.FC<GroupMemberTableRoleSelectorProps> = ({
    row,
    id,
    listParams,
    setIdentities,
    filter,
    ability,
    setMembersUpdated,
    isKsisvs,
}) => {
    const findRoleRequest = useFindAll11Hook()
    const updateGroupRequest = useUpdateRoleOnGroupOrgForIdentityHook()
    const fetchIdentitiesData = useFindRelatedIdentitiesAndCountHook()

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
        const refetchData = await fetchIdentitiesData(id ?? '', {
            ...listParams,
            ...(filter.memberUuid != undefined && { memberUuid: filter.memberUuid }),
            ...(filter.poUuid != undefined && { poUuid: filter.poUuid }),
            ...(filter.role != 'all' && filter.role != undefined && { role: filter.role }),
        })
        setIdentities(refetchData.list)
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
