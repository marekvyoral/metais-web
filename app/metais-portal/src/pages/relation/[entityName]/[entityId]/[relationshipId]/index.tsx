import React from 'react'
import { useParams } from 'react-router-dom'

import { RelationDetailContainer } from '@/components/containers/RelationDetailContainer'
import { RelationDetailView } from '@/components/views/relationships/detail/RelationDetailView'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'

const RelationDetailPage = () => {
    const { relationshipId, entityName, entityId } = useParams()

    return (
        <CiPermissionsWrapper entityId={entityId ?? ''} entityName={entityName ?? ''}>
            <RelationDetailContainer
                relationshipId={relationshipId ?? ''}
                View={(props) => (
                    <RelationDetailView relationshipId={relationshipId ?? ''} entityId={entityId ?? ''} entityName={entityName ?? ''} {...props} />
                )}
            />
        </CiPermissionsWrapper>
    )
}

export default RelationDetailPage
