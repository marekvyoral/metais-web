import React from 'react'
import { Outlet } from 'react-router-dom'

import CreateUserManagement from './create'

export const INDEX_ROUTE = CreateUserManagement

const index: React.FC = () => {
    return <Outlet />
}

export default index
