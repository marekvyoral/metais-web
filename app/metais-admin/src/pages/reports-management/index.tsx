import React from 'react'
import { Outlet } from 'react-router-dom'

import ReportsManagementPage from './reports-management'

export const INDEX_ROUTE = ReportsManagementPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
