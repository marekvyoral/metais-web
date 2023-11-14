import React from 'react'
import { useParams } from 'react-router-dom'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { ProfileDetailContainer } from '@/components/containers/Egov/Profile/ProfileDetailContainer'
import { ProfileDetailView } from '@/components/views/egov/profile-detail-views/ProfileDetailView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const Profile = () => {
    const { entityId } = useParams()
    const { t } = useTranslation()

    return (
        <ProfileDetailContainer
            entityName={entityId ?? ''}
            View={(props) => (
                <>
                    <BreadCrumbs
                        withWidthContainer
                        links={[
                            { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                            { label: t('navMenu.egov.entity'), href: AdminRouteNames.EGOV_PROFILE },
                            {
                                label: t('egov.profile.detailHeading') + ` - ${props.data.ciTypeData?.name}`,
                                href: `${AdminRouteNames.EGOV_PROFILE}/${entityId}`,
                            },
                        ]}
                    />
                    <MainContentWrapper>
                        <ProfileDetailView
                            data={props?.data}
                            setValidityOfProfile={props?.setValidityOfProfile}
                            setValidityOfAttributeProfile={props?.setValidityOfAttributeProfile}
                            entityName={entityId ?? ''}
                            saveAttribute={props?.saveAttribute}
                            setVisibilityOfAttributeProfile={props?.setVisibilityOfAttributeProfile}
                            isError={props.isError}
                            isLoading={props.isLoading}
                        />
                    </MainContentWrapper>
                </>
            )}
        />
    )
}

export default Profile
