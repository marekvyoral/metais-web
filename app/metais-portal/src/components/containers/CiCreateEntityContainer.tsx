import { SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { CiCode, HierarchyRightsResultUi, HierarchyRightsUi, useGenerateCodeAndURL } from '@isdd/metais-common/api'
import { Role, useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { GetImplicitHierarchyFilter, useGetImplicitHierarchy } from '@isdd/metais-common/hooks/useGetImplicitHierarchy'
import { useGetRightForPO } from '@isdd/metais-common/hooks/useGetRightForPO'
import React, { SetStateAction, useEffect, useState } from 'react'

export interface CiCreateEntityContainerData {
    implicitHierarchyData: HierarchyRightsResultUi | undefined
    rightsForPOData: Role[] | undefined
    generatedEntityId: CiCode | undefined
}
export interface ISelectedOrg {
    selectedOrg: HierarchyRightsUi | null
    setSelectedOrg: React.Dispatch<SetStateAction<HierarchyRightsUi | null>>
}

export interface ICiCreateEntityContainerView {
    data: CiCreateEntityContainerData
    selectedOrgState: ISelectedOrg
    isLoading: boolean
    isError: boolean
}
interface ICiCreateEntityContainer {
    View: React.FC<ICiCreateEntityContainerView>
    entityName: string
}

export const CiCreateEntityContainer: React.FC<ICiCreateEntityContainer> = ({ View, entityName }) => {
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

    const { implicitHierarchyData, isLoading, isError } = useGetImplicitHierarchy(defaultCiListPostData)
    const [selectedOrg, setSelectedOrg] = useState<HierarchyRightsUi | null>(null)

    useEffect(() => {
        if (implicitHierarchyData?.rights && selectedOrg === null) {
            setSelectedOrg(implicitHierarchyData.rights[0])
        }
    }, [implicitHierarchyData, selectedOrg])

    const { rightsForPOData } = useGetRightForPO(userId, selectedOrg?.poUUID ?? '', accessToken)
    const { data: generatedEntityId } = useGenerateCodeAndURL(entityName)

    return (
        <View
            data={{ rightsForPOData, implicitHierarchyData, generatedEntityId }}
            selectedOrgState={{ selectedOrg, setSelectedOrg }}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
