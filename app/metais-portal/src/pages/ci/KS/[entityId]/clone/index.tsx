import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { AttributesContainer } from '@isdd/metais-common/components/containers/AttributesContainer'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiCloneContainer } from '@/components/containers/CiCloneContainer'
import { CiContainer } from '@/components/containers/CiContainer'
import { PublicAuthorityAndRoleContainer } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { CloneCiEntityView } from '@/components/views/ci/clone/CloneCiEntityView'

const CloneEntityPage = () => {
    const { t, i18n } = useTranslation()
    const { entityId } = useParams()
    const { entityName } = useParams()
    document.title = `${t('titles.ciClone', { ci: entityName })} | MetaIS`

    const relationTypeTechnicalNames = ['KS_prenajima_KS', 'KS_realizuje_KS']

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
                                    { label: entityName, href: `/ci/${entityName}` },
                                    { label: currentName ? currentName : t('breadcrumbs.noName'), href: `/ci/${entityName}/${entityId}` },
                                    { label: t('breadcrumbs.ciClone', { itemName: currentName }), href: `/ci/${entityName}/${entityId}/edit` },
                                ]}
                            />
                            <MainContentWrapper>
                                <AttributesContainer
                                    entityName={entityName ?? ''}
                                    View={({ data: { ciTypeData, constraintsData, unitsData }, isError: isAttError, isLoading: isAttLoading }) => {
                                        return (
                                            <CiPermissionsWrapper entityName={entityName ?? ''} entityId={entityId ?? ''}>
                                                <PublicAuthorityAndRoleContainer
                                                    View={({
                                                        roleState,
                                                        publicAuthorityState,
                                                        isError: publicAuthAndRoleError,
                                                        isLoading: publicAuthAndRoleLoading,
                                                    }) => (
                                                        <CiCloneContainer
                                                            technicalNames={relationTypeTechnicalNames}
                                                            View={({ data, selectedRelationTypeState }) => (
                                                                <CloneCiEntityView
                                                                    relationData={data}
                                                                    ciTypeData={ciTypeData}
                                                                    constraintsData={constraintsData}
                                                                    unitsData={unitsData}
                                                                    ciItemData={ciItemData}
                                                                    entityId={entityId ?? ''}
                                                                    entityName={entityName ?? ''}
                                                                    roleState={roleState}
                                                                    publicAuthorityState={publicAuthorityState}
                                                                    selectedRelationTypeState={selectedRelationTypeState}
                                                                    isError={[isAttError, publicAuthAndRoleError, isCiItemError].some((item) => item)}
                                                                    isLoading={[isAttLoading, publicAuthAndRoleLoading, isCiItemLoading].some(
                                                                        (item) => item,
                                                                    )}
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                />
                                            </CiPermissionsWrapper>
                                        )
                                    }}
                                />
                            </MainContentWrapper>
                        </>
                    )
                }}
            />
        </>
    )
}

export default CloneEntityPage
