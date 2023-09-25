import React from 'react'
import { Outlet } from 'react-router-dom'

import ProjectsManagementPage from './projects'

export const INDEX_ROUTE = ProjectsManagementPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
