import { Outlet } from 'react-router-dom'
import React from 'react'

import NewRolePage from './NewRole'

export const INDEX_ROUTE = NewRolePage

const index: React.FC = () => {
    return <Outlet />
}
export default index
