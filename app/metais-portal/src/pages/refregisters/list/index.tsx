import React from 'react'
import { Outlet } from 'react-router-dom'

import RefRegistersList from './list'

export const INDEX_ROUTE = RefRegistersList

const index: React.FC = () => {
    return <Outlet />
}

export default index
