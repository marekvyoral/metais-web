import { SelectLazyLoading } from '@isdd/idsk-ui-kit'
import { SortBy, SortType } from '@isdd/idsk-ui-kit/src/types'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { MultiValue } from 'react-select'
import { HierarchyPOFilterUi, HierarchyRightsUi, useReadCiList } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useGetImplicitHierarchy } from '@isdd/metais-common/hooks/useGetImplicitHierarchy'

interface Props {
    onChangeAuthority: (e: HierarchyRightsUi | null) => void
    selectedOrg: HierarchyRightsUi | null
}

export const PublicAuthoritySelect: React.FC<Props> = ({ onChangeAuthority, selectedOrg }) => {
    const { t } = useTranslation()
    const user = useAuth()
    const implicitHierarchy = useReadCiList()
    const userDataGroups = useMemo(() => user.state.user?.groupData ?? [], [user])
    const defaultFilter: HierarchyPOFilterUi = {
        perpage: 20,
        sortBy: SortBy.HIERARCHY_FROM_ROOT,
        sortType: SortType.ASC,
        rights: userDataGroups.map((group) => ({ poUUID: group.orgId, roles: group.roles.map((role) => role.roleUuid) })),
    }

    const { implicitHierarchyData, isError, isLoading } = useGetImplicitHierarchy(defaultFilter)

    const hasError = implicitHierarchy.isError || isError

    useEffect(() => {
        if (implicitHierarchyData?.rights && selectedOrg === null) {
            onChangeAuthority(implicitHierarchyData.rights[0])
        }
    }, [implicitHierarchyData?.rights, onChangeAuthority, selectedOrg])

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
            {isLoading && (
                <QueryFeedback loading={isLoading} error={false} indicatorProps={{ label: t('selectPublicAuthority.loading') }} withChildren />
            )}
            <SelectLazyLoading
                isClearable={false}
                value={selectedOrg}
                error={hasError ? t('selectPublicAuthority.error') : ''}
                getOptionLabel={(item) => item.poName ?? ''}
                getOptionValue={(item) => item.poUUID ?? ''}
                loadOptions={(searchTerm, _, additional) => loadOptions(searchTerm, additional)}
                label={t('createEntity.publicAuthority')}
                name="public-authority"
                onChange={(val: HierarchyRightsUi | MultiValue<HierarchyRightsUi> | null) => onChangeAuthority(Array.isArray(val) ? val[0] : val)}
            />
        </>
    )
}
