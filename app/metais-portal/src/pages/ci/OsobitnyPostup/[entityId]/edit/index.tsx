import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { AttributesContainer } from '@isdd/metais-common/components/containers/AttributesContainer'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { Languages } from '@isdd/metais-common/localization/languages'

import { PublicAuthorityAndRoleContainer } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { ITVSExceptionsCreateContainer } from '@/components/containers/ITVS-exceptions/ITVSExceptionsCreateContainer'
import { CiContainer } from '@/components/containers/CiContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

const EditEntityPage: React.FC = () => {
    const { t, i18n } = useTranslation()
    const { entityId, entityName } = useGetEntityParamsFromUrl()
    // const entityName = 'vynimky_ITVS'
    return (
        <>
            <CiContainer
                configurationItemId={entityId ?? ''}
                View={({ data: ciData, isLoading: isCiItemLoading, isError: isCiItemError }) => {
                    const ciItemData = ciData?.ciItemData

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
                                <AttributesContainer
                                    entityName={entityName ?? ''}
                                    View={({ data: attributesData, isError: attError, isLoading: attLoading }) => (
                                        <PublicAuthorityAndRoleContainer
                                            View={({
                                                data: groupData,
                                                roleState,
                                                publicAuthorityState,
                                                isError: publicAuthAndRoleError,
                                                isLoading: publicAuthAndRoleLoading,
                                            }) => (
                                                <CiPermissionsWrapper entityName={entityName ?? ''} entityId={ciItemData?.uuid ?? ''}>
                                                    <ITVSExceptionsCreateContainer
                                                        entityName={entityName ?? ''}
                                                        data={{ attributesData }}
                                                        ownerId={groupData?.gid ?? ''}
                                                        isLoading={[attLoading, publicAuthAndRoleLoading].some((item) => item)}
                                                        isError={[attError, publicAuthAndRoleError].some((item) => item)}
                                                        roleState={roleState}
                                                        publicAuthorityState={publicAuthorityState}
                                                        updateCiItemId={ciItemData?.uuid}
                                                        ciItemData={ciItemData}
                                                    />
                                                </CiPermissionsWrapper>
                                            )}
                                        />
                                    )}
                                />
                            </MainContentWrapper>
                        </>
                    )
                }}
            />
        </>
    )
}

export default EditEntityPage
