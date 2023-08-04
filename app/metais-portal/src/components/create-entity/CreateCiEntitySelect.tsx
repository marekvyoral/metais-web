import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { Role } from '@isdd/metais-common/contexts/auth/authContext'
import React from 'react'

import { ISelectedOrg } from '../containers/CiCreateEntityContainer'

interface ICreateCiEntitySelect {
    rightsForPOData?: Role[]
    setSelectedRoleId: React.Dispatch<React.SetStateAction<string>>
    selectedOrgState: ISelectedOrg
}

export const CreateCiEntitySelect: React.FC<ICreateCiEntitySelect> = ({ rightsForPOData, setSelectedRoleId, selectedOrgState }) => {
    const { setSelectedOrg, selectedOrg } = selectedOrgState

    return (
        <>
            <SelectPublicAuthorityAndRole
                onChangeAuthority={setSelectedOrg}
                onChangeRole={setSelectedRoleId}
                selectedOrg={selectedOrg}
                rightsForPOData={rightsForPOData}
            />
        </>
    )
}
