import React from 'react'
import { useParams } from 'react-router-dom'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { EntityDetailContainer } from '@/components/containers/Egov/Entity/EntityDetailContainer'
import { EntityDetailView } from '@/components/views/egov/entity-detail-views/EntityDetailView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const Entity = () => {
    const { entityId } = useParams()
    const { t } = useTranslation()
    return (
        <EntityDetailContainer
            entityName={entityId ?? ''}
            View={(props) => (
                <>
                    <BreadCrumbs
                        withWidthContainer
                        links={[
                            { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                            { label: t('navMenu.egov.entity'), href: AdminRouteNames.EGOV_ENTITY },
                            {
                                label: t('egov.entity.detailHeading') + ` - ${props.data.ciTypeData?.name}`,
                                href: `${AdminRouteNames.EGOV_ENTITY}/${entityId}`,
                            },
                        ]}
                    />
                    <MainContentWrapper>
                        <EntityDetailView {...props} />
                    </MainContentWrapper>
                </>
            )}
        />
    )
}

export default Entity
