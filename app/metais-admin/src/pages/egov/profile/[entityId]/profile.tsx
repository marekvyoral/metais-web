import React from 'react'
import { useParams } from 'react-router-dom'

import { ProfileDetailContainer } from '@/components/containers/Egov/Profile/ProfileDetailContainer'
import BasicInformations from '@/components/views/egov/BasicInformations'

const Profile = () => {
    const { entityId } = useParams()

    return (
        <ProfileDetailContainer
            entityName={entityId ?? ''}
            View={({ data: { ciTypeData, constraintsData, unitsData } }) => {
                return <BasicInformations data={{ ciTypeData, constraintsData, unitsData }} />
            }}
        />
    )
}

export default Profile
