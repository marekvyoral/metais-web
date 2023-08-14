import React from 'react'
import { useParams } from 'react-router-dom'

import { UserDetailContainer } from '@/components/containers/ManagementList/UserDetailContainer'
import { UserDetail } from '@/components/views/egov/management-list-views/UserDetail'
import { UserRoles } from '@/components/views/egov/management-list-views/UserRoles'
import { UserAuthetificationItems } from '@/components/views/egov/management-list-views/UserAuthetificationItems'

const DetailUserManagement: React.FC = () => {
    const { userId } = useParams()
    return (
        <UserDetailContainer
            userId={userId ?? ''}
            View={({ data }) => (
                <>
                    <UserDetail userData={data?.userData} userId={userId ?? ''} />
                    <UserRoles userOrganizations={data?.userOrganizations} />
                    <UserAuthetificationItems userData={data?.userData} />
                </>
            )}
        />
    )
}

export default DetailUserManagement
