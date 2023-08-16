import React from 'react'
import { Outlet } from 'react-router-dom'

import Organization from './[entityId]/organization'

export const INDEX_ROUTE = Organization

const OrganizationsDetailPage = () => {
    return <Outlet />
}

export default OrganizationsDetailPage
