import React from 'react'
import { useParams } from 'react-router-dom'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { CreatePublicAuthoritiesContainer } from '@/components/containers/public-authorities/CreatePublicAuthoritiesContainer'
import { CreatePublicAuthoritiesView } from '@/components/views/public-authorities/CreatePublicAuthoritiesView'
import { PublicAuthoritiesDetailContainer } from '@/components/containers/public-authorities/PublicAuthoritiesDetailContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const Edit = () => {
    const { entityId, ico } = useParams()
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('navMenu.publicAuthorities.publicAuthorities'), href: AdminRouteNames.PUBLIC_AUTHORITIES },
                    { label: t('publicAuthorities.detail.title') ?? '', href: `${AdminRouteNames.PUBLIC_AUTHORITIES}/${entityId}` },
                    {
                        label: ico ? t('publicAuthorities.create.addNewOrganization') : t('publicAuthorities.edit.updateExistingOrganization'),
                        href: `${AdminRouteNames.PUBLIC_AUTHORITIES}/${entityId}/edit`,
                    },
                ]}
            />
            <MainContentWrapper>
                <PublicAuthoritiesDetailContainer
                    entityId={entityId ?? ''}
                    View={(orgProps) => (
                        <CreatePublicAuthoritiesContainer
                            View={(props) => (
                                <CreatePublicAuthoritiesView
                                    data={{
                                        ...props?.data,
                                        organizationData: orgProps?.data?.configurationItem,
                                    }}
                                    storePO={props?.storePO}
                                    updatePO={props?.updatePO}
                                    isError={props.isError}
                                    isLoading={props.isLoading}
                                />
                            )}
                        />
                    )}
                />
            </MainContentWrapper>
        </>
    )
}

export default Edit
