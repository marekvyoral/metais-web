import React from 'react'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { CreatePublicAuthoritiesView } from '@/components/views/public-authorities/CreatePublicAuthoritiesView'
import { CreatePublicAuthoritiesContainer } from '@/components/containers/public-authorities/CreatePublicAuthoritiesContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const Create = () => {
    const { t } = useTranslation()
    const { entityId, ico } = useParams()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('navMenu.publicAuthorities.publicAuthorities'), href: AdminRouteNames.PUBLIC_AUTHORITIES },
                    { label: t('publicAuthorities.find.new') ?? '', href: AdminRouteNames.PUBLIC_AUTHORITIES_FIND },
                    {
                        label: t('publicAuthorities.create.addNewOrganization'),
                        href: `${AdminRouteNames.PUBLIC_AUTHORITIES}/${entityId}/${ico}/create`,
                    },
                ]}
            />
            <MainContentWrapper>
                <CreatePublicAuthoritiesContainer
                    View={(props) => (
                        <CreatePublicAuthoritiesView
                            data={props?.data}
                            storePO={props?.storePO}
                            updatePO={props?.updatePO}
                            isError={props.isError}
                            isLoading={props.isLoading}
                        />
                    )}
                />
            </MainContentWrapper>
        </>
    )
}

export default Create
