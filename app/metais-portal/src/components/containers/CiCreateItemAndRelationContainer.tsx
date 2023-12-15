import { ATTRIBUTE_NAME } from '@isdd/metais-common'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { RoleOrgGroup } from '@isdd/metais-common/api/generated/iam-swagger'
import { CiCode, CiType, useGenerateCodeAndURL } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useTranslation } from 'react-i18next'
import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'

import { INewCiRelationData, ISelectedRelationTypeState, useNewCiRelationHook } from '@/hooks/useNewCiRelation.hook'
import { PublicAuthorityState, RoleState, usePublicAuthorityAndRoleHook } from '@/hooks/usePublicAuthorityAndRole.hook'

interface AttributesData {
    ciTypeData: CiType | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData?: EnumType
}

interface CiCreateItemAndRelationData {
    attributesData: AttributesData
    generatedEntityId: CiCode | undefined
    relationData: INewCiRelationData | undefined
    groupData: RoleOrgGroup | undefined
    ciItemData: ConfigurationItemUi | undefined
}

interface CiCreateItemAndRelationStates {
    selectedRelationTypeState: ISelectedRelationTypeState
    publicAuthorityState: PublicAuthorityState
    roleState: RoleState
}

export interface ICiCreateItemAndRelationContainerView {
    ciName: string
    entityName: string
    entityId: string
    tabName: string
    data: CiCreateItemAndRelationData
    states: CiCreateItemAndRelationStates
    isLoading: boolean
    isError: boolean
}

interface ICiCreateItemAndRelationContainer {
    View: React.FC<ICiCreateItemAndRelationContainerView>
    entityName: string
    tabName: string
    configurationItemId?: string
}

export const CiCreateItemAndRelationContainer = ({ View, entityName, tabName, configurationItemId }: ICiCreateItemAndRelationContainer) => {
    const { i18n } = useTranslation()

    const {
        data: generatedEntityId,
        isLoading: generatedIdLoading,
        isError: generatedIdError,
        fetchStatus,
    } = useGenerateCodeAndURL(tabName, { query: { refetchOnMount: false, enabled: !!entityName, cacheTime: 0 } })

    const { ciItemData, isLoading: isCiLoading, isError: isCiError } = useCiHook(configurationItemId)
    const {
        data: relationData,
        selectedRelationTypeState,
        isLoading: isRelationLoading,
        isError: isRelationError,
    } = useNewCiRelationHook({ configurationItemId, entityName, tabName })
    const { ciTypeData, constraintsData, isError: isAttributesError, isLoading: isAttributesLoading, unitsData } = useAttributesHook(tabName)

    const {
        groupData,
        isError: publicAuthAndRoleError,
        isLoading: publicAuthAndRoleLoading,
        publicAuthorityState,
        roleState,
    } = usePublicAuthorityAndRoleHook()

    const ciName =
        i18n.language == Languages.SLOVAK
            ? ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
            : ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]

    const isLoading = [isCiLoading, isAttributesLoading, fetchStatus != 'idle', generatedIdLoading, publicAuthAndRoleLoading, isRelationLoading].some(
        (item) => item,
    )
    const isError = [isCiError, isAttributesError, generatedIdError, publicAuthAndRoleError, isRelationError].some((item) => item)

    return (
        <View
            ciName={ciName}
            tabName={tabName}
            entityName={entityName}
            entityId={configurationItemId ?? ''}
            data={{
                attributesData: {
                    ciTypeData,
                    constraintsData,
                    unitsData,
                },
                generatedEntityId,
                relationData,
                groupData,
                ciItemData,
            }}
            states={{ selectedRelationTypeState, publicAuthorityState, roleState }}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
