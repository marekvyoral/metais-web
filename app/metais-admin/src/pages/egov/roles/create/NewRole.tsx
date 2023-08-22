import React from 'react'

import CreateRoleContainer from '@/components/containers/Egov/Roles/CreateRoleContainer'
import { RoleCreateView } from '@/components/views/egov/roles-detail-views/RoleCreateView'

const NewRolePage: React.FC = () => {
    return <CreateRoleContainer View={(props) => <RoleCreateView createRole={props.createRole} roleGroups={props.roleGroups} />} />
}

export default NewRolePage
