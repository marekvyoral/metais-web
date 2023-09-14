import React from 'react'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { CreateOrganizationView } from '@/components/views/organizations/CreateOrganizationView'
import { CreateOrganizationContainer } from '@/components/containers/organizations/CreateOrganizationContainer'
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
                    { label: t('navMenu.organizations'), href: '/' + AdminRouteNames.ORGANIZATIONS },
                    { label: t('organizations.find.new') ?? '', href: '/' + AdminRouteNames.ORGANIZATIONS + 'find' },
                    {
                        label: t('organizations.create.addNewOrganization'),
                        href: `/${AdminRouteNames.ORGANIZATIONS}/${entityId}/${ico}/create`,
                    },
                ]}
            />
            <MainContentWrapper>
                <CreateOrganizationContainer
                    View={(props) => (
                        <CreateOrganizationView
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
