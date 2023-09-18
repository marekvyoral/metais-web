import React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { OrganizationsDetailContainer } from '@/components/containers/organizations/OrganizationsDetailContainer'
import OrganizationsDetailView from '@/components/views/organizations/OrganizationsDetailView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const Organization = () => {
    const { entityId } = useParams()
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('navMenu.organizations') ?? '', href: '/' + AdminRouteNames.ORGANIZATIONS },
                    { label: t('organizations.detail.title') ?? '', href: '/' + AdminRouteNames.ORGANIZATIONS + entityId },
                ]}
            />
            <MainContentWrapper>
                <OrganizationsDetailContainer
                    entityId={entityId ?? ''}
                    View={(props) => <OrganizationsDetailView {...props.data} isError={props.isError} isLoading={props.isLoading} />}
                />
            </MainContentWrapper>
        </>
    )
}

export default Organization
