import React from 'react'
import { Outlet } from 'react-router-dom'

import SettingsPage from './settings'

export const INDEX_ROUTE = SettingsPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
