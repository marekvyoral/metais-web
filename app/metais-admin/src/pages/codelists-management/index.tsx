import React from 'react'
import { Outlet } from 'react-router-dom'

import Codelists from './codelists'

export const INDEX_ROUTE = Codelists

const index: React.FC = () => {
    return <Outlet />
}

export default index
