import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CreateProfileContainer } from '@/components/containers/Egov/Profile/CreateProfileContainer'
import { CreateEntityView } from '@/components/views/egov/entity-detail-views/CreateEntityView'

const CreateProfile = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('egov.routing.home'), href: AdminRouteNames.HOME, icon: HomeIcon },
                    { label: t('egov.routing.attrProfile'), href: AdminRouteNames.EGOV_PROFILE },
                    { label: t('egov.profile.createHeader'), href: AdminRouteNames.EGOV_PROFILE + '/create' },
                ]}
            />
            <MainContentWrapper>
                <CreateProfileContainer
                    View={(props) => (
                        <CreateEntityView
                            isError={props.isError}
                            isLoading={props.isLoading}
                            data={props?.data}
                            mutate={props?.mutate}
                            hiddenInputs={props?.hiddenInputs}
                            type="profile"
                        />
                    )}
                />
            </MainContentWrapper>
        </>
    )
}

export default CreateProfile
