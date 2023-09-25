import React from 'react'
import { useParams } from 'react-router-dom'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { CreateOrganizationContainer } from '@/components/containers/organizations/CreateOrganizationContainer'
import { CreateOrganizationView } from '@/components/views/organizations/CreateOrganizationView'
import { OrganizationsDetailContainer } from '@/components/containers/organizations/OrganizationsDetailContainer'
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
                    { label: t('navMenu.organizations'), href: AdminRouteNames.ORGANIZATIONS },
                    { label: t('organizations.detail.title') ?? '', href: `${AdminRouteNames.ORGANIZATIONS}/${entityId}` },
                    {
                        label: ico ? t('organizations.create.addNewOrganization') : t('organizations.edit.updateExistingOrganization'),
                        href: `${AdminRouteNames.ORGANIZATIONS}/${entityId}/edit`,
                    },
                ]}
            />
            <MainContentWrapper>
                <OrganizationsDetailContainer
                    entityId={entityId ?? ''}
                    View={(orgProps) => (
                        <CreateOrganizationContainer
                            View={(props) => (
                                <CreateOrganizationView
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
