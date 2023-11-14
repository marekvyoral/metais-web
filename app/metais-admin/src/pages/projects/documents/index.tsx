import React from 'react'
import { Outlet } from 'react-router-dom'

import DocumentsManagementPage from './documents-management'
export const INDEX_ROUTE = DocumentsManagementPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
