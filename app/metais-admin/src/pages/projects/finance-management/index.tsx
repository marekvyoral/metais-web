import React from 'react'
import { Outlet } from 'react-router-dom'

import ProjectFinanceManagementPage from './finance-management-page'

export const INDEX_ROUTE = ProjectFinanceManagementPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
