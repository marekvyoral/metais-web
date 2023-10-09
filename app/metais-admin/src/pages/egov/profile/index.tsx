import React from 'react'
import { Outlet } from 'react-router-dom'

import Profiles from './profile'

export const INDEX_ROUTE = Profiles

const index: React.FC = () => {
    return <Outlet />
}

export default index
