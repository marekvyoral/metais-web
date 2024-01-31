import React from 'react'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'

import { CreateAndEditIntegrationLinkContainer } from '@/components/containers/CreateIntegrationLinkContainer'
import { CreateAndEditIntegrationLinkView } from '@/components/views/prov-integration/CreateIntegrationLinkView'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

export const IntegrationLinkCreate = () => {
    const { t } = useTranslation()
    const { entityId, entityName } = useGetEntityParamsFromUrl()
    document.title = `${t('titles.ciCreateEntity', { ci: entityName })} | MetaIS`

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
                            {
                                label: t('breadcrumbs.ciCreateEntity', { entityName: props.data.ciTypeData?.name }),
                                href: `/ci/create`,
                            },
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
