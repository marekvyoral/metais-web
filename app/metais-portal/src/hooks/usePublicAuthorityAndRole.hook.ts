import { GidRoleData, RoleOrgGroup, useAddOrGetGroup } from '@isdd/metais-common/api/generated/iam-swagger'
import { HierarchyRightsUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import React, { useState } from 'react'

export interface PublicAuthorityState {
    selectedPublicAuthority: HierarchyRightsUi | null
    setSelectedPublicAuthority: React.Dispatch<React.SetStateAction<HierarchyRightsUi | null>>
}

export interface RoleState {
    selectedRole: GidRoleData | null
    setSelectedRole: React.Dispatch<React.SetStateAction<GidRoleData | null>>
}

export interface IPublicAuthorityAndRoleReturnType {
    groupData?: RoleOrgGroup
    publicAuthorityState: PublicAuthorityState
    roleState: RoleState
    isLoading: boolean
    isError: boolean
}

export const usePublicAuthorityAndRoleHook = (): IPublicAuthorityAndRoleReturnType => {
    const [selectedPublicAuthority, setSelectedPublicAuthority] = useState<HierarchyRightsUi | null>(null)
    const [selectedRole, setSelectedRole] = useState<GidRoleData | null>(null)

    const {
        data: groupData,
        isLoading,
        isError,
        isFetched,
    } = useAddOrGetGroup(selectedRole?.roleUuid ?? '', selectedPublicAuthority?.poUUID ?? '', {
        query: { enabled: !!selectedRole && !!selectedPublicAuthority },
    })

    const publicAuthorityState = { selectedPublicAuthority, setSelectedPublicAuthority }
    const selectedRoleState = { selectedRole, setSelectedRole }

    return {
        groupData,
        publicAuthorityState: publicAuthorityState,
        roleState: selectedRoleState,
        isLoading: isFetched && isLoading,
        isError: isFetched && isError,
    }
}
