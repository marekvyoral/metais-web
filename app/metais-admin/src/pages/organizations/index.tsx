import React from 'react'
import { Outlet } from 'react-router-dom'

import Organizations from './organizations'

export const INDEX_ROUTE = Organizations

const index: React.FC = () => {
    return <Outlet />
}

export default index
