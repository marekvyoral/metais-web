import React from 'react'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { IntegrationHarmonogramContainer } from '@/components/containers/IntegrationHarmonogramContainer'
import { IntegrationHarmonogramView } from '@/components/views/prov-integration/integration-link/IntegrationHarmonogramView'

export const IntegrationHarmonogram = () => {
    const { entityId } = useGetEntityParamsFromUrl()

    return <IntegrationHarmonogramContainer entityId={entityId ?? ''} View={(props) => <IntegrationHarmonogramView {...props} />} />
}
