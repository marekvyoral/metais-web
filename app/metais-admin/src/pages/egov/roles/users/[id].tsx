import React from 'react'
import { useParams } from 'react-router-dom'

import RoleUsersContainer from '@/components/containers/Egov/Roles/UsersContainer'
import RoleUsersView from '@/components/views/egov/roles-detail-views/RoleUsersView'

const RoleUsers: React.FC = () => {
    const { id } = useParams()

    return (
        <RoleUsersContainer
            id={id}
            View={(props) => <RoleUsersView roleId={props.roleId} data={props.data} isError={props.isError} isLoading={props.isLoading} />}
        />
    )
}

export default RoleUsers
