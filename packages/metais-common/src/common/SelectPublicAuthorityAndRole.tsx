import { SimpleSelect } from '@isdd/idsk-ui-kit/simple-select/SimpleSelect'
import React, { SetStateAction } from 'react'
import { SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { HierarchyRightsUi } from '@isdd/metais-common/api'
import { GetImplicitHierarchyFilter } from '@isdd/metais-common/hooks/useGetImplicitHierarchy'

import { CiCreateEntityContainerData } from '@components/containers/CiCreateEntityContainer'

interface ISelectPublicAuthorityAndRole {
    onChangeAuthority: (e: any) => void
    onChangeRole: (e: any) => void
    selectedOrg: HierarchyRightsUi | null
    filterCallbacks: {
        setFilter: React.Dispatch<SetStateAction<GetImplicitHierarchyFilter>>
    }
    filter: GetImplicitHierarchyFilter
    ciListAndRolesData: CiCreateEntityContainerData
}

export const SelectPublicAuthorityAndRole: React.FC<ISelectPublicAuthorityAndRole> = ({
    filterCallbacks,
    filter,
    onChangeAuthority,
    onChangeRole,
    selectedOrg,
    ciListAndRolesData,
}) => {
    const { t } = useTranslation()
    const { implicitHierarchyData, rightsForPOData } = ciListAndRolesData

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
                onChange={onChangeAuthority}
            />
            <SimpleSelect
                onChange={onChangeRole}
                label={t('createEntity.role')}
                id="role"
                options={rightsForPOData?.map((role) => ({ value: role.gid ?? '', label: role.roleDescription ?? '' })) ?? [{ value: '', label: '' }]}
            />
        </>
    )
}
