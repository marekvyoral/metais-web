import React from 'react'
import { useParams } from 'react-router-dom'

import { UserDetailContainer } from '@/components/containers/ManagementList/UserDetailContainer'
import { UserManagementForm } from '@/components/views/egov/management-list-views/UserManagementForm'
import { UserManagementContainer } from '@/components/containers/ManagementList/UserManagementContainer'

const EditUserManagement: React.FC = () => {
    const { userId } = useParams()
    return (
        <UserManagementContainer
            View={({ data: managementData }) => (
                <UserDetailContainer
                    userId={userId ?? ''}
                    View={({ data: detailData }) => <UserManagementForm detailData={detailData} managementData={managementData} />}
                />
            )}
        />
    )
}

export default EditUserManagement
