import React from 'react'
import { Outlet } from 'react-router-dom'

import Egov from './egov'

export const indexRoute = Egov

const index: React.FC = () => {
    return <Outlet />
}

export default index
