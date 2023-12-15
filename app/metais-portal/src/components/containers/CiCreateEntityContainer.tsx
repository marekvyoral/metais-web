import { HierarchyRightsUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGenerateCodeAndURL } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import React, { SetStateAction } from 'react'

import { PublicAuthorityState, RoleState, usePublicAuthorityAndRoleHook } from '@/hooks/usePublicAuthorityAndRole.hook'
import { CreateEntityData } from '@/components/create-entity/CreateEntity'

export interface ISelectedOrg {
    selectedOrg: HierarchyRightsUi | null
    setSelectedOrg: React.Dispatch<SetStateAction<HierarchyRightsUi | null>>
}

export interface ICiCreateEntityContainerView {
    entityName: string
    ownerId: string
    roleState: RoleState
    publicAuthorityState: PublicAuthorityState
    data: CreateEntityData
    isLoading: boolean
    isError: boolean
}
interface ICiCreateEntityContainer {
    View: React.FC<ICiCreateEntityContainerView>
    entityName: string
}

export const CiCreateEntityContainer: React.FC<ICiCreateEntityContainer> = ({ View, entityName }) => {
    const {
        data: generatedEntityId,
        isLoading: generatedIdLoading,
        isError: generatedIdError,
        fetchStatus,
    } = useGenerateCodeAndURL(entityName, { query: { refetchOnMount: false, enabled: !!entityName, cacheTime: 0 } })

    const { ciTypeData, constraintsData, unitsData, isError: isAttributesError, isLoading: isAttributesLoading } = useAttributesHook(entityName)
    const {
        groupData,
        isError: publicAuthAndRoleError,
        isLoading: publicAuthAndRoleLoading,
        publicAuthorityState,
        roleState,
    } = usePublicAuthorityAndRoleHook()

    const isLoading = [isAttributesLoading, fetchStatus != 'idle', generatedIdLoading, publicAuthAndRoleLoading].some((item) => item)
    const isError = [isAttributesError, generatedIdError, publicAuthAndRoleError].some((item) => item)

    return (
        <View
            entityName={entityName}
            data={{ attributesData: { ciTypeData, constraintsData, unitsData }, generatedEntityId, ownerId: groupData?.gid ?? '' }}
            ownerId={groupData?.gid ?? ''}
            roleState={roleState}
            publicAuthorityState={publicAuthorityState}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
