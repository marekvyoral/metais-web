import React from 'react'
import { Outlet } from 'react-router-dom'

import Entity from './entity'

export const INDEX_ROUTE = Entity

const index: React.FC = () => {
    return <Outlet />
}

export default index
