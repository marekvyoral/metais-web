import React from 'react'
import { useParams } from 'react-router-dom'

import { ProfileDetailContainer } from '@/components/containers/Egov/Profile/ProfileDetailContainer'
import { ProfileDetailView } from '@/components/views/egov/profile-detail-views/ProfileDetailView'

const Profile = () => {
    const { entityId } = useParams()

    return (
        <ProfileDetailContainer
            entityName={entityId ?? ''}
            View={(props) => <ProfileDetailView data={props?.data} setValidityOfProfile={props?.setValidityOfProfile} entityName={entityId ?? ''} />}
        />
    )
}

export default Profile
