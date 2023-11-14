import React from 'react'
import { Outlet } from 'react-router-dom'

import EkoCode from './[ekoCode]/ekoCode'

export const INDEX_ROUTE = EkoCode

const EkoCodeDetailPage = () => {
    return <Outlet />
}

export default EkoCodeDetailPage
