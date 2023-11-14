import React from 'react'
import { Outlet } from 'react-router-dom'

import RequestListAllPage from './requestListAll'

export const INDEX_ROUTE = RequestListAllPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
