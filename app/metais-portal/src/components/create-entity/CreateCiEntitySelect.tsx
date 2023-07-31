import React, { SetStateAction } from 'react'
import { GetImplicitHierarchyFilter } from '@isdd/metais-common/hooks/useGetImplicitHierarchy'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { HierarchyRightsUi } from '@isdd/metais-common/api'
import { MultiValue } from 'react-select'

import { CiCreateEntityContainerData, ISelectedOrg } from '../containers/CiCreateEntityContainer'

interface ICreateCiEntitySelect {
    ciListAndRolesData: CiCreateEntityContainerData
    setSelectedRoleId: React.Dispatch<React.SetStateAction<string>>
    filterCallbacks: {
        setFilter: React.Dispatch<SetStateAction<GetImplicitHierarchyFilter>>
    }
    selectedOrgState: ISelectedOrg
    filter: GetImplicitHierarchyFilter
}

export const CreateCiEntitySelect: React.FC<ICreateCiEntitySelect> = ({
    ciListAndRolesData,
    setSelectedRoleId,
    filterCallbacks,
    filter,
    selectedOrgState,
}) => {
    const { setSelectedOrg, selectedOrg } = selectedOrgState

    return (
        <>
            <SelectPublicAuthorityAndRole
                onChangeAuthority={(val: HierarchyRightsUi | MultiValue<HierarchyRightsUi> | null) =>
                    setSelectedOrg(Array.isArray(val) ? val[0] : val)
                }
                onChangeRole={(e) => setSelectedRoleId(e.target.value)}
                selectedOrg={selectedOrg}
                filterCallbacks={filterCallbacks}
                filter={filter}
                ciListAndRolesData={ciListAndRolesData}
            />
        </>
    )
}
