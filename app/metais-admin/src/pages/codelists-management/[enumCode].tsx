import React from 'react'
import { Outlet } from 'react-router-dom'

import CodelistDetail from './[enumCode]/codelist'

export const INDEX_ROUTE = CodelistDetail

const CodelistDetailPage = () => {
    return <Outlet />
}

export default CodelistDetailPage
