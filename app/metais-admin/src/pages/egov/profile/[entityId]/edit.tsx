import { useParams } from 'react-router-dom'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { CreateProfileContainer } from '@/components/containers/Egov/Profile/CreateProfileContainer'
import { ProfileDetailContainer } from '@/components/containers/Egov/Profile/ProfileDetailContainer'
import { CreateEntityView } from '@/components/views/egov/entity-detail-views/CreateEntityView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const EditProfile = () => {
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
                            {
                                label: t('egov.profile.editHeader') + ` - ${props.data.ciTypeData?.name}`,
                                href: `${AdminRouteNames.EGOV_PROFILE}/${entityId}/edit`,
                            },
                        ]}
                    />
                    <MainContentWrapper>
                        <CreateProfileContainer
                            View={(createProps) => (
                                <CreateEntityView
                                    data={{
                                        roles: createProps?.data?.roles,
                                        existingEntityData: props?.data?.ciTypeData,
                                    }}
                                    mutate={createProps.mutateEdit}
                                    hiddenInputs={createProps?.hiddenInputs}
                                    isError={props.isError || createProps.isError}
                                    isLoading={createProps.isLoading || props.isLoading}
                                    isEdit
                                    type="profile"
                                />
                            )}
                        />
                    </MainContentWrapper>
                </>
            )}
        />
    )
}

export default EditProfile
