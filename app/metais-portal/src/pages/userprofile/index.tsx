import { Outlet } from 'react-router-dom'

import UserProfilePage from './profile'

export const INDEX_ROUTE = UserProfilePage

const index = () => {
    return <Outlet />
}

export default index
