import React from 'react'

import { HierarchyRightsUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { SelectPublicAuthority } from '@isdd/metais-common/components/select-public-authority-and-role/SelectPublicAuthority'
import { SelectRole } from '@isdd/metais-common/components/select-public-authority-and-role/SelectRole'
import { GidRoleData } from '@isdd/metais-common/api/generated/iam-swagger'

export interface ISelectPublicAuthorityAndRole {
    onChangeAuthority: (e: HierarchyRightsUi | null) => void
    onChangeRole: (val: GidRoleData | null) => void
    selectedOrg: HierarchyRightsUi | null
    selectedRole: GidRoleData
    ciRoles: string[]
}

export const SelectPublicAuthorityAndRole: React.FC<ISelectPublicAuthorityAndRole> = ({
    onChangeAuthority,
    onChangeRole,
    selectedOrg,
    selectedRole,
    ciRoles,
}) => {
    return (
        <>
            <SelectPublicAuthority onChangeAuthority={onChangeAuthority} selectedOrg={selectedOrg} ciRoles={ciRoles} />
            <SelectRole onChangeRole={onChangeRole} selectedOrg={selectedOrg} selectedRole={selectedRole} ciRoles={ciRoles} />
        </>
    )
}
