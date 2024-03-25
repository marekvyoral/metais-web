import { ATTRIBUTE_NAME } from '@isdd/metais-common'
import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useTranslation } from 'react-i18next'

import { useNewCiRelationHook } from '@/hooks/useNewCiRelation.hook'
import { usePublicAuthorityAndRoleHook } from '@/hooks/usePublicAuthorityAndRole.hook'

type PropsType = {
    entityName: string
    tabName: string
    configurationItemId?: string
}

export const useCiRelationHook = ({ entityName, tabName, configurationItemId }: PropsType) => {
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
    return {
        ciName,
        tabName,
        entityName,
        entityId: configurationItemId ?? '',
        groupData,
        ciItemData,
        ownerGid: groupData?.gid ?? '',
        publicAuthorityState,
        relationData,
        roleState,
        selectedRelationTypeState,
        isLoading,
        isError,
    }
}
