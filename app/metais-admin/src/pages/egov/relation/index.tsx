import React from 'react'
import { Outlet } from 'react-router-dom'

import Relation from './relation'

export const INDEX_ROUTE = Relation

const index: React.FC = () => {
    return <Outlet />
}

export default index
