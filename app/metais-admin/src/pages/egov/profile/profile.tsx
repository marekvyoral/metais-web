import { EntityFilterData } from '@isdd/metais-common/componentHelpers/filter/feFilters'

import { ProfileListContainer } from '@/components/containers/Egov/Profile/ProfileListContainer'
import { EntityFilter } from '@/components/filters/EntityFilter'
import { EgovTable } from '@/components/table/EgovTable'

const Profile = () => {
    const defaultFilterValues: EntityFilterData = { name: '', technicalName: '', type: '', valid: '' }

    return (
        <ProfileListContainer
            defaultFilterValues={defaultFilterValues}
            View={(props) => {
                return (
                    <>
                        <EntityFilter defaultFilterValues={defaultFilterValues} />
                        <EgovTable data={props?.data} entityName={'profile'} />
                    </>
                )
            }}
        />
    )
}

export default Profile
