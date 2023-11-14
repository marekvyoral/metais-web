import { Outlet } from 'react-router-dom'
import React from 'react'

import RoleUsers from './Users'

export const INDEX_ROUTE = RoleUsers

const index: React.FC = () => {
    return <Outlet />
}
export default index
