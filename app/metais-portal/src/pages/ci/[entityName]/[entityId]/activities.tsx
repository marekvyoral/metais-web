import React from 'react'
import { useParams } from 'react-router-dom'

import { ActivitiesListContainer } from '@/components/containers/ActivitiesListContainer'
import { ActivitiesView } from '@/components/views/ci/activities/ActivitiesView'

const ActivitiesListPage: React.FC = () => {
    const { entityId } = useParams()

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
