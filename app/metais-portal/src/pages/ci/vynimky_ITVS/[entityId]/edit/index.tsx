import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { OrgPermissionsWrapper } from '@isdd/metais-common/components/permissions/OrgPermissionsWrapper'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { PublicAuthorityAndRoleContainer } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { ITVSExceptionsCreateContainer } from '@/components/containers/ITVS-exceptions/ITVSExceptionsCreateContainer'
import { CiContainer } from '@/components/containers/CiContainer'
import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const EditEntityPage: React.FC = () => {
    const { t, i18n } = useTranslation()
    const { entityId } = useParams()
    const entityName = 'vynimky_ITVS'
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: entityName ?? '', href: `/ci/${entityName}` },
                    { label: t('breadcrumbs.ciEdit', { itemName: '//TODO ci name' }), href: `/ci/create` },
                ]}
            />
            <MainContentWrapper>
                <CiContainer
                    configurationItemId={entityId ?? ''}
                    View={({ data: ciData, isLoading: isCiItemLoading, isError: isCiItemError }) => {
                        const ciItemData = ciData?.ciItemData
                        console.log(ciItemData)

                        // const currentName =
                        //     i18n.language == Languages.SLOVAK
                        //         ? ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
                        //         : ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]
                        return (
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
                                            <OrgPermissionsWrapper
                                                selectedOrganizationId={publicAuthorityState?.selectedPublicAuthority?.poUUID ?? ''}
                                            >
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
                                            </OrgPermissionsWrapper>
                                        )}
                                    />
                                )}
                            />
                        )
                    }}
                />
            </MainContentWrapper>
        </>
    )
}

export default EditEntityPage
