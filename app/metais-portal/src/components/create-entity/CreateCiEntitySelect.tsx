import React, { SetStateAction } from 'react'

import { CiCreateEntityContainerData, GetImplicitHierarchyFilter, ISelectedOrg } from '../containers/CiCreateEntityContainer'

import { SelectPublicAuthorityAndRole } from '@/common/SelectPublicAuthorityAndRole'

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
                onChangeAuthority={(val) => setSelectedOrg(Array.isArray(val) ? val[0] : val)}
                onChangeRole={(e) => setSelectedRoleId(e.target.value)}
                selectedOrg={selectedOrg}
                filterCallbacks={filterCallbacks}
                filter={filter}
                ciListAndRolesData={ciListAndRolesData}
            />
            {/* <SelectLazyLoading
                option={undefined}
                value={selectedOrg}
                getOptionLabel={(item) => item.poName ?? ''}
                getOptionValue={(item) => item.poUUID ?? ''}
                loadOptions={(searchTerm, _, additional) => loadOptions(searchTerm, additional)}
                label={t('createEntity.publicAuthority')}
                name="public-authority"
                onChange={(val) => setSelectedOrg(Array.isArray(val) ? val[0] : val)}
            />
            <SimpleSelect
                onChange={(e) => setSelectedRoleId(e.target.value)}
                label={t('createEntity.role')}
                id="role"
                options={rightsForPOData?.map((role) => ({ value: role.gid ?? '', label: role.roleDescription ?? '' })) ?? [{ value: '', label: '' }]}
            /> */}
        </>
    )
}
