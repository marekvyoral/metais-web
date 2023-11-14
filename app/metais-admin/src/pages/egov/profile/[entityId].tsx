import React from 'react'
import { Outlet } from 'react-router-dom'

import Profile from './[entityId]/profile'

export const INDEX_ROUTE = Profile

const EgovDetailPage = () => {
    return <Outlet />
}

export default EgovDetailPage
