import { SimpleSelect, TextBody } from '@isdd/idsk-ui-kit/index'
import {
    FindRelatedIdentitiesAndCountParams,
    IdentitiesInGroupAndCount,
    Role,
    useFindAll11Hook,
    useFindRelatedIdentitiesAndCountHook,
    useUpdateRoleOnGroupOrgForIdentityHook,
} from '@isdd/metais-common/src/api/generated/iam-swagger'
import React, { useState } from 'react'
import { Row } from '@tanstack/react-table'

import styles from '../styles.module.scss'
import { DEFAULT_ROLES } from '../defaultRoles'
import { canUserEditRoles } from '../standartizationUtils'

import { FilterParams, TableData } from '@/components/containers/KSISVSVContainer'

interface KSICSTableRoleSelectorProps {
    row: Row<TableData>
    id?: string
    userRoles: string[] | undefined
    listParams: FindRelatedIdentitiesAndCountParams
    setIdentities: (value: React.SetStateAction<IdentitiesInGroupAndCount | undefined>) => void
    filter: FilterParams
}

const KSIVSTableRoleSelector: React.FC<KSICSTableRoleSelectorProps> = ({ row, id, userRoles, listParams, setIdentities, filter }) => {
    const findRoleRequest = useFindAll11Hook()
    const updateGroupRequest = useUpdateRoleOnGroupOrgForIdentityHook()
    const fetchIdentitiesData = useFindRelatedIdentitiesAndCountHook()

    const [isSelectorShown, setSelectorShown] = useState(false)
    const [selectedRole, setSelectedRole] = useState<string>(row.original.roleName)
    if (isSelectorShown) {
        return (
            <SimpleSelect
                value={selectedRole}
                onChange={async (value) => {
                    setSelectedRole(value.target.value)
                    const oldRole: Role = (await findRoleRequest({ name: row.original.roleName })) as Role
                    const newRole: Role = (await findRoleRequest({ name: value.target.value })) as Role
                    await updateGroupRequest(row.original.uuid, id ?? '', oldRole.uuid ?? '', newRole.uuid ?? '', row.original.orgId)
                    setSelectorShown(false)
                    const refetchData = await fetchIdentitiesData(id ?? '', {
                        ...listParams,
                        ...(filter.memberUuid != undefined && { memberUuid: filter.memberUuid }),
                        ...(filter.poUuid != undefined && { poUuid: filter.poUuid }),
                        ...(filter.role != 'all' && filter.role != undefined && { role: filter.role }),
                    })
                    setIdentities(refetchData)
                }}
                label=""
                options={DEFAULT_ROLES.map((item) => ({
                    value: item.code,
                    label: item.value,
                }))}
            />
        )
    } else {
        return canUserEditRoles(userRoles) ? (
            <a
                className={styles.cursorPointer}
                onClick={() => {
                    setSelectorShown(true)
                }}
            >
                {DEFAULT_ROLES.find((role) => role.description == row.original.roleName)?.value}
            </a>
        ) : (
            <TextBody>{DEFAULT_ROLES.find((role) => role.description == row.original.roleName)?.value}</TextBody>
        )
    }
}

export default KSIVSTableRoleSelector
