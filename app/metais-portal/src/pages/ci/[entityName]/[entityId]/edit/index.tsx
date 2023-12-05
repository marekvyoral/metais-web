import React from 'react'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { Languages } from '@isdd/metais-common/localization/languages'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { AttributesContainer } from '@isdd/metais-common/components/containers/AttributesContainer'

import { CiContainer } from '@/components/containers/CiContainer'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { EditCiEntityView } from '@/components/views/ci/edit/EditCiEntityView'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

const EditEntityPage = () => {
    const { t, i18n } = useTranslation()
    const { entityId, entityName } = useGetEntityParamsFromUrl()
    document.title = `${t('titles.ciEdit', { ci: entityName })} | MetaIS`

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
                                    { label: t('breadcrumbs.ciEdit', { itemName: currentName }), href: `/ci/${entityName}/${entityId}/edit` },
                                ]}
                            />
                            <MainContentWrapper>
                                <AttributesContainer
                                    entityName={entityName ?? ''}
                                    View={({ data: { ciTypeData, constraintsData, unitsData }, isError: isAttError, isLoading: isAttLoading }) => {
                                        return (
                                            <CiPermissionsWrapper entityName={entityName ?? ''} entityId={entityId ?? ''}>
                                                <EditCiEntityView
                                                    ciTypeData={ciTypeData}
                                                    constraintsData={constraintsData}
                                                    unitsData={unitsData}
                                                    ciItemData={ciItemData}
                                                    entityId={entityId ?? ''}
                                                    entityName={entityName ?? ''}
                                                    isError={[isAttError, isCiItemError].some((item) => item)}
                                                    isLoading={[isAttLoading, isCiItemLoading].some((item) => item)}
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

export default EditEntityPage
