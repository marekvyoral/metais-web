import React from 'react'
import { Outlet } from 'react-router-dom'

import DashboardPage from './dashboard'

export const INDEX_ROUTE = DashboardPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
