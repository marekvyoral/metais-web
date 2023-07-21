import React, { SetStateAction, useEffect, useState } from 'react'
import { SortBy, SortType } from '@isdd/idsk-ui-kit/types'

import { CiCode, ReadCiList200, HierarchyRightsUi, useGenerateCodeAndURL } from '@/api'
import { Role, useAuth } from '@/contexts/auth/authContext'
import { useGetRightForPO } from '@/hooks/useGetRightForPO'
import { useGetImplicitHierarchy } from '@/hooks/useGetImplicitHierarchy'

export interface GetImplicitHierarchyFilter {
    fullTextSearch: ''
    page: number
    perpage: number
    sortBy: string
    sortType: string
    rights: {
        poUUID: string
        roles: string[]
    }[]
}

export interface CiCreateEntityContainerData {
    implicitHierarchyData: ReadCiList200 | undefined
    rightsForPOData: Role[] | undefined
    generatedEntityId: CiCode | undefined
}
export interface ISelectedOrg {
    selectedOrg: HierarchyRightsUi | null
    setSelectedOrg: React.Dispatch<SetStateAction<HierarchyRightsUi | null>>
}

export interface ICiCreateEntityContainerView {
    data: CiCreateEntityContainerData

    filter: GetImplicitHierarchyFilter

    filterCallbacks: {
        setFilter: React.Dispatch<SetStateAction<GetImplicitHierarchyFilter>>
    }
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

    const [filter, setFilter] = useState(defaultCiListPostData)

    const { implicitHierarchyData, isLoading, isError } = useGetImplicitHierarchy(filter)
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
            filter={filter}
            filterCallbacks={{ setFilter }}
            selectedOrgState={{ selectedOrg, setSelectedOrg }}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
