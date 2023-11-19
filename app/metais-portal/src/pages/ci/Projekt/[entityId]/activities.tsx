import React from 'react'
import { ENTITY_ACTIVITY, P_REALIZUJE_AKT } from '@isdd/metais-common/constants'

import { ActivitiesAndGoalsListContainer } from '@/components/containers/ActivitiesAndGoalsListContainer'
import { ActivitiesAndGoalsView } from '@/components/views/ci/activities/ActivitiesAndGoalsView'
import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

const ActivitiesListPage: React.FC = () => {
    const { entityId } = useGetEntityParamsFromUrl()

    return (
        <ActivitiesAndGoalsListContainer
            ciType={ENTITY_ACTIVITY}
            relType={P_REALIZUJE_AKT}
            configurationItemId={entityId}
            View={(props) => {
                return <ActivitiesAndGoalsView {...props} />
            }}
        />
    )
}

export default ActivitiesListPage
