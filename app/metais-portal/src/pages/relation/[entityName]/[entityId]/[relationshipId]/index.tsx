import React from 'react'
import { useParams } from 'react-router-dom'

import { RelationDetailContainer } from '@/components/containers/RelationDetailContainer'
import { RelationDetailView } from '@/components/views/relationships/detail/RelationDetailView'

const RelationDetailPage = () => {
    const { relationshipId, entityName, entityId } = useParams()

    return (
        <RelationDetailContainer
            relationshipId={relationshipId ?? ''}
            entityId={entityId ?? ''}
            View={(props) => (
                <RelationDetailView relationshipId={relationshipId ?? ''} entityId={entityId ?? ''} entityName={entityName ?? ''} {...props} />
            )}
        />
    )
}

export default RelationDetailPage
