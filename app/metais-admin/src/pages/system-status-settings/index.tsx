import React from 'react'
import { Outlet } from 'react-router-dom'

import SystemStatusSettingsPage from './system-status-settings'

export const INDEX_ROUTE = SystemStatusSettingsPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
