import React from 'react'

import { UserManagementForm } from '@/components/views/egov/management-list-views/UserManagementForm'
import { UserManagementContainer } from '@/components/containers/ManagementList/UserManagementContainer'

const CreateUserManagement: React.FC = () => {
    return (
        <UserManagementContainer
            View={({ data: managementData }) => <UserManagementForm isCreate detailData={undefined} managementData={managementData} />}
        />
    )
}

export default CreateUserManagement
