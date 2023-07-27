import React from 'react'

import { ProfileListContainer } from '@/components/containers/Egov/Profile/ProfileListContainer'
import { EgovTable } from '@/components/table/EgovTable'

const Profile = () => {
    return (
        <ProfileListContainer
            View={(props) => {
                return <EgovTable data={props?.data?.attributeProfileList} entityName={'profile'} />
            }}
        />
    )
}

export default Profile
