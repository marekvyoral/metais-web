import React from 'react'
import { Outlet } from 'react-router-dom'

import DocumentsGroupPage from './documents-group'
export const INDEX_ROUTE = DocumentsGroupPage

const documentsGroup: React.FC = () => {
    return <Outlet />
}

export default documentsGroup
