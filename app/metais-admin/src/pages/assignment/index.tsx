import React from 'react'
import { Outlet } from 'react-router-dom'

import AssignmentPage from './assignment'

export const INDEX_ROUTE = AssignmentPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
