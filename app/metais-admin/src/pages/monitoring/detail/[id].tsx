import React from 'react'
import { Outlet } from 'react-router-dom'

import MonitoringDetail from './[id]/monitoringDetail'

export const INDEX_ROUTE = MonitoringDetail

const MonitoringDetailPage = () => {
    return <Outlet />
}

export default MonitoringDetailPage
