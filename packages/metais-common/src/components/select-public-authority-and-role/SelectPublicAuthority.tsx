import { SelectLazyLoading } from '@isdd/idsk-ui-kit'
import { SortBy, SortType } from '@isdd/idsk-ui-kit/src/types'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MultiValue } from 'react-select'

import { HierarchyPOFilterUi, HierarchyRightsUi, useReadCiList } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import { useGetImplicitHierarchy } from '@isdd/metais-common/hooks/useGetImplicitHierarchy'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

interface Props {
    onChangeAuthority: (e: HierarchyRightsUi | null) => void
    selectedOrg: HierarchyRightsUi | null
    ciRoles: string[]
    publicAuthorityLabel?: string
}

export const SelectPublicAuthority: React.FC<Props> = ({ onChangeAuthority, selectedOrg, ciRoles, publicAuthorityLabel }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const implicitHierarchy = useReadCiList()

    const filteredUserGroupDataBasedOnRole = user?.groupData.filter((group) =>
        ciRoles.some((ciRole) => group.roles.find((role) => role.roleName == ciRole)),
    )

    const defaultFilter: HierarchyPOFilterUi = {
        perpage: 20,
        sortBy: SortBy.HIERARCHY_FROM_ROOT,
        sortType: SortType.ASC,
        //why is BE not filtering this based on rights?
        rights: filteredUserGroupDataBasedOnRole?.map((group) => ({
            poUUID: group.orgId,
            roles: group.roles.filter((role) => ciRoles.includes(role.roleName)).map((role) => role.roleUuid),
        })),
    }

    const isEnabled = defaultFilter?.rights?.[0]?.roles && defaultFilter?.rights?.[0]?.roles.length > 0
    const { implicitHierarchyData, isError, isLoading } = useGetImplicitHierarchy(defaultFilter, !!isEnabled)

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
                label={publicAuthorityLabel || t('createEntity.publicAuthority')}
                name="public-authority"
                onChange={(val: HierarchyRightsUi | MultiValue<HierarchyRightsUi> | null) => onChangeAuthority(Array.isArray(val) ? val[0] : val)}
            />
        </>
    )
}
