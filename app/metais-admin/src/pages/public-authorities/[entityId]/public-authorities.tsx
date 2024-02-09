import React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { PublicAuthoritiesDetailContainer } from '@/components/containers/public-authorities/PublicAuthoritiesDetailContainer'
import PublicAuthoritiesDetailView from '@/components/views/public-authorities/PublicAuthoritiesDetailView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const PublicAuthorities = () => {
    const { entityId } = useParams()
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('navMenu.publicAuthorities.publicAuthorities') ?? '', href: AdminRouteNames.PUBLIC_AUTHORITIES_LIST },
                    { label: t('publicAuthorities.detail.title') ?? '', href: `${AdminRouteNames.PUBLIC_AUTHORITIES}/${entityId}` },
                ]}
            />
            <MainContentWrapper>
                <PublicAuthoritiesDetailContainer
                    entityId={entityId ?? ''}
                    View={(props) => <PublicAuthoritiesDetailView {...props.data} isError={props.isError} isLoading={props.isLoading} />}
                />
            </MainContentWrapper>
        </>
    )
}

export default PublicAuthorities
