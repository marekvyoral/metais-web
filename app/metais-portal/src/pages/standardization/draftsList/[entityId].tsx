import React from 'react'
import { Outlet } from 'react-router-dom'

import DraftDetail from '@/pages/standardization/draftsList/[entityId]/form'

export const INDEX_ROUTE = DraftDetail

const DraftsListFormPage: React.FC = () => {
    return <Outlet />
}
export default DraftsListFormPage
