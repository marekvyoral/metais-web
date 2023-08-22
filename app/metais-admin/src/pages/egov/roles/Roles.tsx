import React from 'react'

import RoleListContainer from '@/components/containers/Egov/Roles/RolesListContainer'
import RoleListView from '@/components/views/egov/roles-detail-views/RolesListView'

const ManageRoles: React.FC = () => {
    return (
        <RoleListContainer
            View={(props) => (
                <RoleListView
                    isError={props.isError}
                    isLoading={props.isLoading}
                    filter={props.filter}
                    tableRoleGroups={props.tableRoleGroups}
                    tableData={props.tableData}
                    rolesPages={props.rolesPages}
                    roleToDelete={props.roleToDelete}
                    setRoleToDelete={props.setRoleToDelete}
                    setTableRoles={props.setTableRoles}
                    setPagination={props.setPagination}
                    pagination={props.pagination}
                    setSorting={props.setSorting}
                    sorting={props.sorting}
                />
            )}
        />
    )
}

export default ManageRoles
