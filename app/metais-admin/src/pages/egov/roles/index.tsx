import { Outlet } from 'react-router-dom'
import React from 'react'

import ManageRoles from './Roles'

export const INDEX_ROUTE = ManageRoles

const index: React.FC = () => {
    return <Outlet />
}
export default index
