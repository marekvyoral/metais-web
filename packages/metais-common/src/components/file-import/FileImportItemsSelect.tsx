import { SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import React, { SetStateAction, useEffect } from 'react'

import { HierarchyRightsUi } from '@isdd/metais-common/api'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { GetImplicitHierarchyFilter, useGetImplicitHierarchy } from '@isdd/metais-common/hooks/useGetImplicitHierarchy'
import { useGetRightForPO } from '@isdd/metais-common/hooks/useGetRightForPO'

interface IFileImportItemsSelect {
    ciType: string
    setSelectedRoleId: React.Dispatch<SetStateAction<string>>
    setSelectedOrg: React.Dispatch<SetStateAction<HierarchyRightsUi | null>>
    selectedOrg: HierarchyRightsUi | null
}

export const FileImportItemsSelect: React.FC<IFileImportItemsSelect> = ({ setSelectedRoleId, setSelectedOrg, selectedOrg }) => {
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

    const { implicitHierarchyData } = useGetImplicitHierarchy(defaultCiListPostData)

    useEffect(() => {
        if (implicitHierarchyData?.rights && selectedOrg === null) {
            setSelectedOrg(implicitHierarchyData.rights[0])
        }
    }, [implicitHierarchyData?.rights, selectedOrg, setSelectedOrg])

    const { rightsForPOData } = useGetRightForPO(userId, selectedOrg?.poUUID ?? '', accessToken)

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