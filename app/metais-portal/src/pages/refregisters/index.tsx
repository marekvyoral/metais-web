import { Outlet } from 'react-router-dom'

import ReferenceRegisters from './refRegisterList'

export const INDEX_ROUTE = ReferenceRegisters

const index = () => {
    return <Outlet />
}

export default index
