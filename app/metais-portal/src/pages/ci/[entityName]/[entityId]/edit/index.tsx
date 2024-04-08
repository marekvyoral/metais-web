import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useTranslation } from 'react-i18next'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { getCiHowToBreadCrumb, useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { EditCiEntityView } from '@/components/views/ci/edit/EditCiEntityView'

const EditEntityPage = () => {
    const { t, i18n } = useTranslation()
    const { entityId, entityName } = useGetEntityParamsFromUrl()

    const { ciItemData, isLoading: isCiItemLoading, isError: isCiItemError, gestorData } = useCiHook(entityId)
    const { constraintsData, ciTypeData, unitsData, isLoading: isAttLoading, isError: isAttError } = useAttributesHook(entityName)
    const ciTypeName = i18n.language === Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName
    document.title = `${t('titles.ciEdit', {
        ci: ciTypeName,
        itemName: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
    })} ${META_IS_TITLE}`

    const currentName =
        i18n.language == Languages.SLOVAK
            ? ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
            : ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]

    return (
        <>
            <>
                <BreadCrumbs
                    withWidthContainer
                    links={[
                        { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                        ...getCiHowToBreadCrumb(entityName ?? '', t),
                        { label: t('titles.ciList', { ci: ciTypeName }), href: `/ci/${entityName}` },
                        { label: currentName ? currentName : t('breadcrumbs.noName'), href: `/ci/${entityName}/${entityId}` },
                        { label: t('breadcrumbs.ciEdit', { itemName: currentName }), href: `/ci/${entityName}/${entityId}/edit` },
                    ]}
                />
                <MainContentWrapper>
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
                            ownerId={gestorData?.[0].owner ?? ''}
                        />
                    </CiPermissionsWrapper>
                </MainContentWrapper>
            </>
        </>
    )
}

export default EditEntityPage
