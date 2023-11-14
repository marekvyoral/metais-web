import React from 'react'
import { Outlet } from 'react-router-dom'

import draftsList from '@/pages/standardization/draftslist/list'

export const INDEX_ROUTE = draftsList

const DraftsListManyPage: React.FC = () => {
    return <Outlet />
}

export default DraftsListManyPage
