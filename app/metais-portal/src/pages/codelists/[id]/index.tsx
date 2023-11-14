import { Outlet } from 'react-router-dom'

import Detail from './detail'

export const INDEX_ROUTE = Detail

const index = () => {
    return <Outlet />
}

export default index
