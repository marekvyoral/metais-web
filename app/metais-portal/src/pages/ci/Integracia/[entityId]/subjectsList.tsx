import React from 'react'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { IntegrationSubjectsListContainer } from '@/components/containers/IntegrationSubjectsListContainer'
import { IntegrationSubjectsListView } from '@/components/views/prov-integration/integration-link/IntegrationSubjectsListView'

export const IntegrationSubjectsList = () => {
    const { entityId } = useGetEntityParamsFromUrl()

    return <IntegrationSubjectsListContainer entityId={entityId ?? ''} View={(props) => <IntegrationSubjectsListView {...props} />} />
}
