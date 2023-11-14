import React from 'react'
import { Outlet } from 'react-router-dom'

import UserManagementListPage from './list'

export const INDEX_ROUTE = UserManagementListPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
