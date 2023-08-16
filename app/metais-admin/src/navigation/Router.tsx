import * as React from 'react'
import { Route, Routes } from 'react-router'

import { computedRoutes } from './fileBasedRoutes'

import { RootRouteContainer } from '@/navigation/route-containers/RootRouteContainer'

export const Router: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<RootRouteContainer />}>
                <Route>{computedRoutes()}</Route>
            </Route>
        </Routes>
    )
}
