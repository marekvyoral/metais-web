import React from 'react'
import { Outlet } from 'react-router-dom'

import LocalizationList from './localization'

export const INDEX_ROUTE = LocalizationList

const index: React.FC = () => {
    return <Outlet />
}

export default index
