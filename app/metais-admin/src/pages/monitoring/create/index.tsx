import { Outlet } from 'react-router-dom'

import MonitoringCreatePage from './monitoringCreate'

export const INDEX_ROUTE = MonitoringCreatePage

const index: React.FC = () => {
    return <Outlet />
}

export default index
