import React from 'react'
import { useParams } from 'react-router-dom'

import { RelationDetailContainer } from '@/components/containers/Egov/Relation/RelationsDetailContainer'
import { RelationDetailView } from '@/components/views/egov/relation-detail-views/RelationDetailView'

const Profile = () => {
    const { entityId } = useParams()
    return <RelationDetailContainer entityName={entityId ?? ''} View={(data) => <RelationDetailView data={data?.data} />} />
}

export default Profile
