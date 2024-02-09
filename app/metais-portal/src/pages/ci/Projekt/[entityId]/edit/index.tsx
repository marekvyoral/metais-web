import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { ENTITY_PROJECT } from '@isdd/metais-common/constants'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { EditProjectView } from '@/components/views/ci/project/EditProjectView'

const EditProjectPage = () => {
    const { t, i18n } = useTranslation()
    const { entityId } = useParams()
    const entityName = ENTITY_PROJECT

    const { ciItemData, isLoading: isCiItemLoading, isError: isCiItemError } = useCiHook(entityId)
    const { constraintsData, ciTypeData, unitsData, isLoading: isAttLoading, isError: isAttError } = useAttributesHook(entityName)

    const currentName =
        i18n.language == Languages.SLOVAK
            ? ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
            : ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]

    document.title = `${t('titles.ciEdit', { ci: ciTypeData?.name, itemName: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] })} | MetaIS`

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('titles.ciList', { ci: ciTypeData?.name }), href: `/ci/${entityName}` },
                    { label: currentName ? currentName : t('breadcrumbs.noName'), href: `/ci/${entityName}/${entityId}` },
                    { label: t('breadcrumbs.ciEdit', { itemName: currentName }), href: `/ci/${entityName}/${entityId}/edit` },
                ]}
            />
            <MainContentWrapper>
                <CiPermissionsWrapper entityName={entityName ?? ''} entityId={entityId ?? ''}>
                    <EditProjectView
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
            </MainContentWrapper>
        </>
    )
}

export default EditProjectPage
