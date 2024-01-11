import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { IntegrationKsAsListContainer } from '@/components/containers/IntegrationKsAsListContainer'
import { IntegrationKsAsListView } from '@/components/views/prov-integration/integration-link/IntegrationKsAsListView'

export const IntegrationKsAsList = () => {
    const { entityId } = useGetEntityParamsFromUrl()

    return <IntegrationKsAsListContainer entityId={entityId ?? ''} View={(props) => <IntegrationKsAsListView {...props} />} />
}
