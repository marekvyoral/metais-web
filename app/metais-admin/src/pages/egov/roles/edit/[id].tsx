import React from 'react'
import { useParams } from 'react-router-dom'

import EditEntityContainer from '@/components/containers/Egov/Roles/EditEntityContainer'
import RoleEditView from '@/components/views/egov/roles-detail-views/RoleEditView'

const EditRole: React.FC = () => {
    const { id } = useParams()

    return (
        <EditEntityContainer
            id={id}
            View={(props) => (
                <RoleEditView
                    currentRole={props.currentRole}
                    roleId={props.roleId}
                    isLoading={props.isLoading}
                    updateRole={props.updateRole}
                    roleGroups={props.roleGroups}
                />
            )}
        />
    )
}

export default EditRole
