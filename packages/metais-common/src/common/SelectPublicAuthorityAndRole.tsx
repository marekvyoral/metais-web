import { SimpleSelect } from '@isdd/idsk-ui-kit/simple-select/SimpleSelect'
import React, { ChangeEventHandler } from 'react'
import { SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { MultiValue } from 'react-select'

import { HierarchyRightsUi, useReadCiList } from '@isdd/metais-common/api'
import { GetImplicitHierarchyFilter } from '@isdd/metais-common/hooks/useGetImplicitHierarchy'
import { Role } from '@isdd/metais-common/contexts/auth/authContext'

interface ISelectPublicAuthorityAndRole {
    onChangeAuthority: (e: HierarchyRightsUi | MultiValue<HierarchyRightsUi> | null) => void
    onChangeRole: ChangeEventHandler<HTMLSelectElement>
    selectedOrg: HierarchyRightsUi | null
    defaultFilter: GetImplicitHierarchyFilter
    rightsForPOData?: Role[]
}

export const SelectPublicAuthorityAndRole: React.FC<ISelectPublicAuthorityAndRole> = ({
    defaultFilter,
    onChangeAuthority,
    onChangeRole,
    selectedOrg,
    rightsForPOData,
}) => {
    const { t } = useTranslation()
    const implicitHierarchy = useReadCiList()
    const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
        const page = !additional?.page ? 1 : (additional?.page || 0) + 1
        const updatedFilter = {
            ...defaultFilter,
            page: page,
            fullTextSearch: searchQuery,
        }
        const options = await implicitHierarchy.mutateAsync({ data: updatedFilter })
        return {
            options: options.rights || [],
            hasMore: options.rights?.length ? true : false,
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
                options={
                    rightsForPOData?.map((role: Role) => ({ value: role.gid ?? '', label: role.roleDescription ?? '' })) ?? [{ value: '', label: '' }]
                }
            />
        </>
    )
}
