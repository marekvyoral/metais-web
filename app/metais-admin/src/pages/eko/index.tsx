import React from 'react'
import { Outlet } from 'react-router-dom'

import Eko from './eko'

export const INDEX_ROUTE = Eko

const index: React.FC = () => {
    return <Outlet />
}

export default index
