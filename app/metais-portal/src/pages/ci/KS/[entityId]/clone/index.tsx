import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { ENTITY_KS } from '@isdd/metais-common/constants'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiCloneContainer } from '@/components/containers/CiCloneContainer'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { CloneCiEntityView } from '@/components/views/ci/clone/CloneCiEntityView'

const CloneKSPage = () => {
    const { t } = useTranslation()
    const { entityId } = useParams()
    const entityName = ENTITY_KS

    const relationTypeTechnicalNames = ['KS_prenajima_KS', 'KS_realizuje_KS']

    return (
        <CiCloneContainer
            entityName={entityName ?? ''}
            configurationItemId={entityId ?? ''}
            technicalNames={relationTypeTechnicalNames}
            View={(props) => {
                document.title = `${t('titles.ciClone', {
                    ci: props.ciTypeData?.name,
                    itemName: props.ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
                })} | MetaIS`

                return (
                    <>
                        <BreadCrumbs
                            withWidthContainer
                            links={[
                                { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                                { label: entityName ?? '', href: `/ci/${entityName}` },
                                { label: props.ciName ? props.ciName : t('breadcrumbs.noName'), href: `/ci/${entityName}/${entityId}` },
                                { label: t('breadcrumbs.ciClone', { itemName: props.ciName }), href: `/ci/${entityName}/${entityId}/edit` },
                            ]}
                        />
                        <MainContentWrapper>
                            <CiPermissionsWrapper entityName={entityName ?? ''} entityId={entityId ?? ''}>
                                <CloneCiEntityView {...props} />
                            </CiPermissionsWrapper>
                        </MainContentWrapper>
                    </>
                )
            }}
        />
    )
}

export default CloneKSPage
