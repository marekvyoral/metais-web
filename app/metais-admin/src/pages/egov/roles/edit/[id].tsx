import { Outlet } from 'react-router-dom'
import React from 'react'

import EditRole from './Edit'

export const INDEX_ROUTE = EditRole

const index: React.FC = () => {
    return <Outlet />
}
export default index
