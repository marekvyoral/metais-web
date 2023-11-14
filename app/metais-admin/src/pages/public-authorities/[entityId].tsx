import React from 'react'
import { Outlet } from 'react-router-dom'

import Organization from './[entityId]/public-authorities'

export const INDEX_ROUTE = Organization

const OrganizationsDetailPage = () => {
    return <Outlet />
}

export default OrganizationsDetailPage
