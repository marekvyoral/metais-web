import React from 'react'
import { Outlet } from 'react-router-dom'

import UserManagementPage from './user-management'

export const INDEX_ROUTE = UserManagementPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
