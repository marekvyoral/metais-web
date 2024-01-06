import { ENTITY_CIEL, KRIS_stanovuje_Ciel } from '@isdd/metais-common/constants'
import React from 'react'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { ActivitiesAndGoalsListContainer } from '@/components/containers/ActivitiesAndGoalsListContainer'
import { ActivitiesAndGoalsView } from '@/components/views/ci/activities/ActivitiesAndGoalsView'

const Goals: React.FC = () => {
    const { entityId } = useGetEntityParamsFromUrl()

    return (
        <ActivitiesAndGoalsListContainer
            ciType={ENTITY_CIEL}
            relType={KRIS_stanovuje_Ciel}
            configurationItemId={entityId}
            View={(props) => {
                return <ActivitiesAndGoalsView {...props} />
            }}
        />
    )
}

export default Goals
