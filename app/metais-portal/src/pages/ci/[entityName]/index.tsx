import { Outlet } from 'react-router-dom'

import Entity from './entity'

export const INDEX_ROUTE = Entity

const index = () => {
    return <Outlet />
}

export default index
