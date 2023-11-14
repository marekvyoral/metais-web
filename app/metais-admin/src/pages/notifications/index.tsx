import React from 'react'
import { Outlet } from 'react-router-dom'

import NotificationsPage from './notifications'

export const INDEX_ROUTE = NotificationsPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
