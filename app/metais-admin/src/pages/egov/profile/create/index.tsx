import React from 'react'
import { Outlet } from 'react-router-dom'

import CreateProfile from './create'

export const INDEX_ROUTE = CreateProfile

const index: React.FC = () => {
    return <Outlet />
}

export default index
