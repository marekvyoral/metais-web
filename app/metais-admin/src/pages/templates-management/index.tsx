import React from 'react'
import { Outlet } from 'react-router-dom'

import TemplatesManagementPage from './templates-management'

export const INDEX_ROUTE = TemplatesManagementPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
