import React from 'react'
import { Outlet } from 'react-router-dom'

import { Home } from './Home'

export const INDEX_ROUTE = Home

const index: React.FC = () => {
    return <Outlet />
}

export default index
