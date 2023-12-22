import { Outlet } from 'react-router-dom'

import MonitoringListPage from './monitoringList'

export const INDEX_ROUTE = MonitoringListPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
