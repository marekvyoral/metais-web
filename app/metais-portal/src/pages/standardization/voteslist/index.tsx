import { Outlet } from 'react-router-dom'

import VotesList from './voteslist'

export const INDEX_ROUTE = VotesList

const index: React.FC = () => {
    return <Outlet />
}

export default index
