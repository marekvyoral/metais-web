import React from 'react'
import { useParams } from 'react-router-dom'

import { RelationDetailContainer } from '@/components/containers/Egov/Relation/RelationsDetailContainer'
import BasicInformations from '@/components/views/egov/BasicInformations'

const Profile = () => {
    const { entityId } = useParams()
    return (
        <RelationDetailContainer
            entityName={entityId ?? ''}
            View={({ data: { ciTypeData, constraintsData, unitsData } }) => {
                return <BasicInformations data={{ ciTypeData, constraintsData, unitsData }} />
            }}
        />
    )
}

export default Profile
