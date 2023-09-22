import React from 'react'
import { Outlet } from 'react-router-dom'

import GdprRequestListPage from './gdprRequestList'

export const INDEX_ROUTE = GdprRequestListPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
