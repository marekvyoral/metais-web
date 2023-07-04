import React from 'react'
import { useParams } from 'react-router-dom'

import { EntityDetailContainer } from '@/components/containers/Egov/Entity/EntityDetailContainer'
import { EntityDetailView } from '@/components/views/egov/entity-detail-views/EntityDetailView'

const Entity = () => {
    const { entityId } = useParams()
    return <EntityDetailContainer entityName={entityId ?? ''} View={(data) => <EntityDetailView data={data?.data} />} />
}

export default Entity
