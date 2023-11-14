import React from 'react'
import { Outlet } from 'react-router-dom'

import MonitoringPage from './monitoring'

export const INDEX_ROUTE = MonitoringPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
