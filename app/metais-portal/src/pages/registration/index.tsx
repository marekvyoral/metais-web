import { Outlet } from 'react-router-dom'

import Registration from './registration'

export const INDEX_ROUTE = Registration

const index = () => {
    return <Outlet />
}

export default index
