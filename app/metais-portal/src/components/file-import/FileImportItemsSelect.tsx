import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SortBy, SortType } from '@isdd/idsk-ui-kit/types'

import { GetImplicitHierarchyFilter } from '../containers/CiCreateEntityContainer'

import { HierarchyRightsUi, useGenerateCodeAndURL } from '@/api'
import { useAuth } from '@/contexts/auth/authContext'
import { SelectPublicAuthorityAndRole } from '@/common/SelectPublicAuthorityAndRole'
import { useGetImplicitHierarchy } from '@/hooks/useGetImplicitHierarchy'
import { useGetRightForPO } from '@/hooks/useGetRightForPO'

interface IFileImportItemsSelect {
    ciType: string
}

export const FileImportItemsSelect: React.FC<IFileImportItemsSelect> = ({ ciType }) => {
    const { t } = useTranslation()

    const user = useAuth()
    const userId = user.state.user?.uuid ?? ''
    const userDataGroups = user.state.user?.groupData ?? []
    const accessToken = user.state.accessToken ?? ''
    const defaultCiListPostData: GetImplicitHierarchyFilter = {
        fullTextSearch: '',
        page: 1,
        perpage: 20,
        sortBy: SortBy.HIERARCHY_FROM_ROOT,
        sortType: SortType.ASC,
        rights: userDataGroups.map((group) => ({ poUUID: group.orgId, roles: group.roles.map((role) => role.roleUuid) })),
    }

    const [filter, setFilter] = useState(defaultCiListPostData)
    const [selectedOrg, setSelectedOrg] = useState<HierarchyRightsUi | null>(null)
    const [selectedRoleId, setSelectedRoleId] = useState<string>('')
    const { implicitHierarchyData, isLoading, isError } = useGetImplicitHierarchy(filter)

    useEffect(() => {
        if (implicitHierarchyData?.rights && selectedOrg === null) {
            setSelectedOrg(implicitHierarchyData.rights[0])
        }
    }, [implicitHierarchyData, selectedOrg])

    const { rightsForPOData } = useGetRightForPO(userId, selectedOrg?.poUUID ?? '', accessToken)
    const { data: generatedEntityId } = useGenerateCodeAndURL(ciType)

    return (
        <>
            <SelectPublicAuthorityAndRole
                onChangeAuthority={(val) => setSelectedOrg(Array.isArray(val) ? val[0] : val)}
                onChangeRole={(e) => setSelectedRoleId(e.target.value)}
                selectedOrg={selectedOrg}
                filterCallbacks={{ setFilter }}
                filter={filter}
                ciListAndRolesData={{ rightsForPOData, generatedEntityId, implicitHierarchyData }}
            />
        </>
    )
}
