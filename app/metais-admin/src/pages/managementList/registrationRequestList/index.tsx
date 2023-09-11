import React from 'react'
import { Outlet } from 'react-router-dom'

import RegistrationRequestListPage from './registrationRequestList'

export const INDEX_ROUTE = RegistrationRequestListPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
