import React from 'react'
import { Outlet } from 'react-router-dom'

import Entity from './[entityId]/entity'

export const INDEX_ROUTE = Entity

const EgovDetailPage = () => {
    return <Outlet />
}

export default EgovDetailPage