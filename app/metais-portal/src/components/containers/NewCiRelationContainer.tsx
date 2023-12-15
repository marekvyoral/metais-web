import { ATTRIBUTE_NAME } from '@isdd/metais-common'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { RoleOrgGroup } from '@isdd/metais-common/api/generated/iam-swagger'
import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useTranslation } from 'react-i18next'

import { INewCiRelationData, ISelectedRelationTypeState, useNewCiRelationHook } from '@/hooks/useNewCiRelation.hook'
import { PublicAuthorityState, RoleState, usePublicAuthorityAndRoleHook } from '@/hooks/usePublicAuthorityAndRole.hook'

export interface INewCiRelationContainerView {
    ciName: string
    entityName: string
    entityId: string
    tabName: string
    selectedRelationTypeState: ISelectedRelationTypeState
    publicAuthorityState: PublicAuthorityState
    roleState: RoleState
    relationData: INewCiRelationData | undefined
    groupData: RoleOrgGroup | undefined
    ciItemData: ConfigurationItemUi | undefined
    ownerGid: string
    isLoading: boolean
    isError: boolean
}

interface INewCiRelationContainer {
    View: React.FC<INewCiRelationContainerView>
    entityName: string
    tabName: string
    configurationItemId?: string
}

export const NewCiRelationContainer = ({ View, entityName, tabName, configurationItemId }: INewCiRelationContainer) => {
    const { i18n } = useTranslation()

    const { ciItemData, isLoading: isCiLoading, isError: isCiError } = useCiHook(configurationItemId)
    const {
        data: relationData,
        selectedRelationTypeState,
        isLoading: isRelationLoading,
        isError: isRelationError,
    } = useNewCiRelationHook({ configurationItemId, entityName, tabName })

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

    const isLoading = [isCiLoading, publicAuthAndRoleLoading, isRelationLoading].some((item) => item)
    const isError = [isCiError, publicAuthAndRoleError, isRelationError].some((item) => item)

    return (
        <View
            ciName={ciName}
            tabName={tabName}
            entityName={entityName}
            entityId={configurationItemId ?? ''}
            groupData={groupData}
            ciItemData={ciItemData}
            ownerGid={groupData?.gid ?? ''}
            publicAuthorityState={publicAuthorityState}
            relationData={relationData}
            roleState={roleState}
            selectedRelationTypeState={selectedRelationTypeState}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
