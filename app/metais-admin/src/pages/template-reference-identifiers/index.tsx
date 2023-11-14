import React from 'react'
import { Outlet } from 'react-router-dom'

import TemplateReferenceIdentifiersPage from './template-reference-identifiers'

export const INDEX_ROUTE = TemplateReferenceIdentifiersPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
