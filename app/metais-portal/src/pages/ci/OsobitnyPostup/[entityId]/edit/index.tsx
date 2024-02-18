import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useAttributesHook } from '@isdd/metais-common/src/hooks/useAttributes.hook'
import { useCiHook } from '@isdd/metais-common/src/hooks/useCi.hook'
import { useTranslation } from 'react-i18next'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { ITVSExceptionsCreateContainer } from '@/components/containers/ITVS-exceptions/ITVSExceptionsCreateContainer'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { usePublicAuthorityAndRoleHook } from '@/hooks/usePublicAuthorityAndRole.hook'

const ITVSExceptionsEditPage: React.FC = () => {
    const { t, i18n } = useTranslation()
    const { entityId, entityName } = useGetEntityParamsFromUrl()

    const { ciItemData, isError: isCiError, isLoading: isCiLoading } = useCiHook(entityId ?? '')
    const { ciTypeData, constraintsData, unitsData, isLoading: isAttLoading, isError: isAttError } = useAttributesHook(entityName ?? '')
    const ciTypeName = i18n.language === Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName
    const {
        groupData,
        publicAuthorityState,
        roleState,
        isError: publicAuthAndRoleError,
        isLoading: publicAuthAndRoleLoading,
    } = usePublicAuthorityAndRoleHook()

    const currentName =
        i18n.language == Languages.SLOVAK
            ? ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
            : ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]
    const entityIdToUpdate = {
        cicode: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_kod_metais],
        ciurl: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_ref_id],
    }

    document.title = `${t('titles.ciEdit', {
        ci: ciTypeName,
        itemName: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
    })} ${META_IS_TITLE}`

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('titles.ciList', { ci: ciTypeName }), href: `/ci/${entityName}` },
                    { label: currentName ? currentName : t('breadcrumbs.noName'), href: `/ci/${entityName}/${entityId}` },
                    { label: t('breadcrumbs.ciEdit', { itemName: currentName }), href: `/ci/${entityName}/${entityId}/edit` },
                ]}
            />
            <MainContentWrapper>
                <CiPermissionsWrapper entityName={entityName ?? ''} entityId={ciItemData?.uuid ?? ''}>
                    <ITVSExceptionsCreateContainer
                        entityName={entityName ?? ''}
                        data={{ attributesData: { ciTypeData, constraintsData, unitsData }, generatedEntityId: entityIdToUpdate }}
                        ownerId={groupData?.gid ?? ''}
                        isLoading={[isAttLoading, publicAuthAndRoleLoading, isCiLoading].some((item) => item)}
                        isError={[isAttError, publicAuthAndRoleError, isCiError].some((item) => item)}
                        roleState={roleState}
                        publicAuthorityState={publicAuthorityState}
                        updateCiItemId={ciItemData?.uuid}
                        ciItemData={ciItemData}
                    />
                </CiPermissionsWrapper>
            </MainContentWrapper>
        </>
    )
}

export default ITVSExceptionsEditPage
