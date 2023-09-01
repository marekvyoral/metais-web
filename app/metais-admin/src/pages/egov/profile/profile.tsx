import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { EntityFilterData } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { ProfileListContainer } from '@/components/containers/Egov/Profile/ProfileListContainer'
import { EntityFilter } from '@/components/filters/EntityFilter'
import { EgovTable } from '@/components/table/EgovTable'

const Profile = () => {
    const defaultFilterValues: EntityFilterData = { name: '', technicalName: '', type: '', valid: '' }
    const { t } = useTranslation()
    return (
        <ProfileListContainer
            defaultFilterValues={defaultFilterValues}
            View={(props) => {
                return (
                    <>
                        <BreadCrumbs
                            links={[
                                { label: t('egov.routing.home'), href: AdminRouteNames.HOME, icon: HomeIcon },
                                { label: t('egov.routing.attrProfile'), href: AdminRouteNames.TOOLTIPS },
                            ]}
                        />
                        <TextHeading size={'L'}>{t('egov.routing.profileList')}</TextHeading>
                        <EntityFilter defaultFilterValues={defaultFilterValues} />
                        <EgovTable isFetching={props?.isFetching} refetch={props?.refetch} data={props?.data} entityName={'profile'} />
                    </>
                )
            }}
        />
    )
}

export default Profile
