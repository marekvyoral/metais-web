import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CreateAndEditIntegrationLinkContainer } from '@/components/containers/CreateIntegrationLinkContainer'
import { CreateAndEditIntegrationLinkView } from '@/components/views/prov-integration/CreateIntegrationLinkView'

export const EditIntegrationLinkPage = () => {
    const { t } = useTranslation()
    const { entityId, entityName } = useGetEntityParamsFromUrl()
    document.title = `${t('titles.ciEdit', { ci: entityName })} ${META_IS_TITLE}`

    return (
        <CreateAndEditIntegrationLinkContainer
            entityName={entityName ?? ''}
            entityId={entityId ?? ''}
            View={(props) => (
                <>
                    <BreadCrumbs
                        withWidthContainer
                        links={[
                            { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                            { label: props.ciTypeName, href: `/ci/${entityName}` },
                            { label: props.ciItemDataName ? props.ciItemDataName : t('breadcrumbs.noName'), href: `/ci/${entityName}/${entityId}` },
                            { label: t('breadcrumbs.ciEdit', { itemName: props.ciItemDataName }), href: `/ci/${entityName}/${entityId}/edit` },
                        ]}
                    />
                    <MainContentWrapper>
                        <CreateAndEditIntegrationLinkView {...props} />
                    </MainContentWrapper>
                </>
            )}
        />
    )
}
