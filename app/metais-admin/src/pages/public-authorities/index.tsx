import React from 'react'
import { Outlet } from 'react-router-dom'

import PublicAuthoritiesPage from './public-authorities'

export const INDEX_ROUTE = PublicAuthoritiesPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
