import React from 'react'
import { Outlet } from 'react-router-dom'

import RequestListPage from './requestList'

export const INDEX_ROUTE = RequestListPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
