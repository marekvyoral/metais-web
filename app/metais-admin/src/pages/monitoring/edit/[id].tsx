import { Outlet } from 'react-router-dom'

import MonitoringEditPage from './[id]/monitoringEdit'

export const INDEX_ROUTE = MonitoringEditPage

const index: React.FC = () => {
    return <Outlet />
}

export default index
