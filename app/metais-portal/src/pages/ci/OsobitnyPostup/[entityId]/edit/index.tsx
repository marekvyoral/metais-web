import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useCiContainer } from '@isdd/metais-common/src/hooks/useCiContainer'
import { useAttributesContainer } from '@isdd/metais-common/src/hooks/useAttributesContainer'
import { usePublicAuthorityAndRoleContainer } from '@isdd/metais-common/src/hooks/usePublicAuthorityAndRoleContainer'

import { ITVSExceptionsCreateContainer } from '@/components/containers/ITVS-exceptions/ITVSExceptionsCreateContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

const EditEntityPage: React.FC = () => {
    const { t, i18n } = useTranslation()
    const { entityId, entityName } = useGetEntityParamsFromUrl()

    const { ciItemData, isError: isCiError, isLoading: isCiLoading } = useCiContainer(entityId ?? '')
    const { ciTypeData, constraintsData, unitsData, isLoading: isAttLoading, isError: isAttError } = useAttributesContainer(entityName ?? '')
    const {
        groupData,
        publicAuthorityState,
        selectedRoleState,
        isError: publicAuthAndRoleError,
        isLoading: publicAuthAndRoleLoading,
    } = usePublicAuthorityAndRoleContainer()

    const currentName =
        i18n.language == Languages.SLOVAK
            ? ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
            : ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('ITVSExceptions.vynimky_ITVS'), href: `/ci/${entityName}` },
                    { label: currentName ? currentName : t('breadcrumbs.noName'), href: `/ci/${entityName}/${entityId}` },
                    { label: t('breadcrumbs.ciEdit', { itemName: currentName }), href: `/ci/${entityName}/${entityId}/edit` },
                ]}
            />
            <MainContentWrapper>
                <CiPermissionsWrapper entityName={entityName ?? ''} entityId={ciItemData?.uuid ?? ''}>
                    <ITVSExceptionsCreateContainer
                        entityName={entityName ?? ''}
                        data={{ attributesData: { ciTypeData, constraintsData, unitsData } }}
                        ownerId={groupData?.gid ?? ''}
                        isLoading={[isAttLoading, publicAuthAndRoleLoading, isCiLoading].some((item) => item)}
                        isError={[isAttError, publicAuthAndRoleError, isCiError].some((item) => item)}
                        roleState={selectedRoleState}
                        publicAuthorityState={publicAuthorityState}
                        updateCiItemId={ciItemData?.uuid}
                        ciItemData={ciItemData}
                    />
                </CiPermissionsWrapper>
            </MainContentWrapper>
        </>
    )
}

export default EditEntityPage
