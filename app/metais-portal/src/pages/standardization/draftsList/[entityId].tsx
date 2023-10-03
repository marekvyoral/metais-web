import React from 'react'
import { Outlet } from 'react-router-dom'

import DraftDetail from './[entityId]/form'

import { StandardDraftsListPermissionsWrapper } from '@/components/permissions/StandardDraftsListPermissionsWrapper'
export const INDEX_ROUTE = DraftDetail

const DraftsListFormPage: React.FC = () => {
    return (
        <StandardDraftsListPermissionsWrapper>
            <Outlet />
        </StandardDraftsListPermissionsWrapper>
    )
}
export default DraftsListFormPage
