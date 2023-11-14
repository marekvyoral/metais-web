import React from 'react'

import RoleListContainer from '@/components/containers/Egov/Roles/RolesListContainer'
import RoleListView from '@/components/views/egov/roles-detail-views/RolesListView'

const ManageRoles: React.FC = () => {
    return <RoleListContainer View={(props) => <RoleListView {...props} />} />
}

export default ManageRoles
