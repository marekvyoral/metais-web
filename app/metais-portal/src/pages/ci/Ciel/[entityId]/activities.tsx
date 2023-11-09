import React from 'react'

import { ActivitiesListContainer } from '@/components/containers/ActivitiesListContainer'
import { ActivitiesView } from '@/components/views/ci/activities/ActivitiesView'
import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

const ActivitiesListPage: React.FC = () => {
    const { entityId } = useGetEntityParamsFromUrl()

    return (
        <ActivitiesListContainer
            configurationItemId={entityId}
            View={(props) => {
                return <ActivitiesView {...props} />
            }}
        />
    )
}

export default ActivitiesListPage
