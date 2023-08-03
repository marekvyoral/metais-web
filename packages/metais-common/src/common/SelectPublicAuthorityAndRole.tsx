import { SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { SimpleSelect } from '@isdd/idsk-ui-kit/simple-select/SimpleSelect'
import { SortBy, SortType } from '@isdd/idsk-ui-kit/src/types'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { MultiValue } from 'react-select'

import { HierarchyPOFilterUi, HierarchyRightsUi, useReadCiList } from '@isdd/metais-common/api'
import { Role, useAuth } from '@isdd/metais-common/contexts/auth/authContext'

interface ISelectPublicAuthorityAndRole {
    onChangeAuthority: (e: HierarchyRightsUi | null) => void
    onChangeRole: (val: string) => void
    selectedOrg: HierarchyRightsUi | null
    rightsForPOData?: Role[]
}

export const SelectPublicAuthorityAndRole: React.FC<ISelectPublicAuthorityAndRole> = ({
    onChangeAuthority,
    onChangeRole,
    selectedOrg,
    rightsForPOData,
}) => {
    const { t } = useTranslation()
    const implicitHierarchy = useReadCiList()
    const user = useAuth()

    const userDataGroups = useMemo(() => user.state.user?.groupData ?? [], [user])
    const defaultFilter: HierarchyPOFilterUi = {
        perpage: 20,
        sortBy: SortBy.HIERARCHY_FROM_ROOT,
        sortType: SortType.ASC,
        rights: userDataGroups.map((group) => ({ poUUID: group.orgId, roles: group.roles.map((role) => role.roleUuid) })),
    }

    const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
        const page = !additional?.page ? 1 : (additional?.page || 0) + 1
        const options = await implicitHierarchy.mutateAsync({ data: { ...defaultFilter, page, fullTextSearch: searchQuery } })
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
                onChange={(val: HierarchyRightsUi | MultiValue<HierarchyRightsUi> | null) => onChangeAuthority(Array.isArray(val) ? val[0] : val)}
            />
            <SimpleSelect
                onChange={(e) => {
                    onChangeRole(e.target.value)
                }}
                label={t('createEntity.role')}
                id="role"
                options={
                    rightsForPOData?.map((role: Role) => ({ value: role.gid ?? '', label: role.roleDescription ?? '' })) ?? [{ value: '', label: '' }]
                }
            />
        </>
    )
}
