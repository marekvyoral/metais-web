import React from 'react'
import { Outlet } from 'react-router-dom'

import ManagementBodiesPage from './public-authorities'

export const INDEX_ROUTE = ManagementBodiesPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
