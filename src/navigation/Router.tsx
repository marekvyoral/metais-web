import * as React from 'react'
import { Route, Routes } from 'react-router'

import { Home } from '../pages/Home'
import { DevTestScreen } from '../pages/DevTestScreen'

import { RootRouteContainer } from './route-containers/RootRouteContainer'
import { RouteNames } from './routeNames'

export const Router: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<RootRouteContainer />}>
                <Route path={RouteNames.HOME} element={<Home />} />
            </Route>
            <Route path={RouteNames.DEV_TEST_SCREEN} element={<DevTestScreen />} />
        </Routes>
    )
}
