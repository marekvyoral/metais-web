import { SimpleSelect } from '@isdd/idsk-ui-kit/simple-select/SimpleSelect'
import React, { SetStateAction } from 'react'
import { SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'

import { CiCreateEntityContainerData, GetImplicitHierarchyFilter, ISelectedOrg } from '../containers/CiCreateEntityContainer'

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
    const { t } = useTranslation()
    const { implicitHierarchyData, rightsForPOData } = ciListAndRolesData

    const { setSelectedOrg, selectedOrg } = selectedOrgState
    const { setFilter } = filterCallbacks

    const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
        const page = !additional?.page ? 1 : (additional?.page || 0) + 1
        const options = implicitHierarchyData?.rights
        const updatedFilter = {
            ...filter,
            page: page + 1,
        }
        setFilter(updatedFilter)

        return {
            options: options || [],
            hasMore: options?.length ? true : false,
            additional: {
                page: page,
            },
        }
    }

    return (
        <>
            <SelectLazyLoading
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
            />
        </>
    )
}
