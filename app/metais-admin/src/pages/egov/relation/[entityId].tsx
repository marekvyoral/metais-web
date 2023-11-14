import React from 'react'
import { Outlet } from 'react-router-dom'

import Relation from './[entityId]/relation'

export const INDEX_ROUTE = Relation

const EgovDetailPage = () => {
    return <Outlet />
}

export default EgovDetailPage
