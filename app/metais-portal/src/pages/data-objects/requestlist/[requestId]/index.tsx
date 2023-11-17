import React from 'react'
import { Outlet } from 'react-router-dom'

import Detail from './detail'

export const INDEX_ROUTE = Detail

const index: React.FC = () => {
    return <Outlet />
}
export default index
