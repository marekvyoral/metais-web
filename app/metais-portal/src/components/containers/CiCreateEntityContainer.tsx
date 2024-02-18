import { HierarchyRightsUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGenerateCodeAndURL } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import React, { SetStateAction } from 'react'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useTranslation } from 'react-i18next'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

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
    ciTypeName: string
}
interface ICiCreateEntityContainer {
    View: React.FC<ICiCreateEntityContainerView>
    entityName: string
}

export const CiCreateEntityContainer: React.FC<ICiCreateEntityContainer> = ({ View, entityName }) => {
    const { t, i18n } = useTranslation()
    const {
        data: generatedEntityId,
        isLoading: generatedIdLoading,
        isError: generatedIdError,
        fetchStatus,
    } = useGenerateCodeAndURL(entityName, { query: { refetchOnMount: false, enabled: !!entityName, cacheTime: 0 } })

    const { ciTypeData, constraintsData, unitsData, isError: isAttributesError, isLoading: isAttributesLoading } = useAttributesHook(entityName)
    const ciTypeName = i18n.language === Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName
    const {
        groupData,
        isError: publicAuthAndRoleError,
        isLoading: publicAuthAndRoleLoading,
        publicAuthorityState,
        roleState,
    } = usePublicAuthorityAndRoleHook()

    const isLoading = [isAttributesLoading, fetchStatus != 'idle', generatedIdLoading, publicAuthAndRoleLoading].some((item) => item)
    const isError = [isAttributesError, generatedIdError, publicAuthAndRoleError].some((item) => item)

    document.title = `${t('titles.ciCreateEntity', { ci: ciTypeName })} ${META_IS_TITLE}`

    return (
        <View
            entityName={entityName}
            data={{ attributesData: { ciTypeData, constraintsData, unitsData }, generatedEntityId, ownerId: groupData?.gid ?? '' }}
            ownerId={groupData?.gid ?? ''}
            roleState={roleState}
            publicAuthorityState={publicAuthorityState}
            isLoading={isLoading}
            isError={isError}
            ciTypeName={ciTypeName ?? ''}
        />
    )
}
