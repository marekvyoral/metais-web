import React from 'react'
import { Outlet } from 'react-router-dom'

import Profile from './profile'

export const INDEX_ROUTE = Profile

const index: React.FC = () => {
    return <Outlet />
}

export default index
