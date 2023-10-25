import React from 'react'
import { Outlet } from 'react-router-dom'

import List from './requestList'

export const INDEX_ROUTE = List

const index: React.FC = () => {
    return <Outlet />
}
export default index