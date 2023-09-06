import React from 'react'

import { HierarchyRightsUi } from '@isdd/metais-common/api'
import { SelectPublicAuthority } from '@isdd/metais-common/components/select-public-authority-and-role/SelectPublicAuthority'
import { SelectRole } from '@isdd/metais-common/components/select-public-authority-and-role/SelectRole'

export interface ISelectPublicAuthorityAndRole {
    onChangeAuthority: (e: HierarchyRightsUi | null) => void
    onChangeRole: (val: string) => void
    selectedOrg: HierarchyRightsUi | null
    selectedRoleId: string
}

export const SelectPublicAuthorityAndRole: React.FC<ISelectPublicAuthorityAndRole> = ({
    onChangeAuthority,
    onChangeRole,
    selectedOrg,
    selectedRoleId,
}) => {
    return (
        <>
            <SelectPublicAuthority onChangeAuthority={onChangeAuthority} selectedOrg={selectedOrg} />
            <SelectRole onChangeRole={onChangeRole} selectedOrg={selectedOrg} selectedRoleId={selectedRoleId} />
        </>
    )
}
