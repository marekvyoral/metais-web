import React from 'react'
import { Outlet } from 'react-router-dom'

import GlobalSearchPage from './search'

export const INDEX_ROUTE = GlobalSearchPage

const index: React.FC = () => {
    return <Outlet />
}
export default index
