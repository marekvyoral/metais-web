import React from 'react'
import { Route, Routes } from 'react-router'

import { RootRouteContainer } from '@admin/navigation/route-containers/RootRouteContainer'
import { RouteNames } from '@admin/navigation/routeNames'
import { DevTestScreen } from '@admin/pages/DevTestScreen'
import { Home } from '@admin/pages/Home'
import { Index } from '@admin/pages/egov'

export const Router: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<RootRouteContainer />}>
                <Route path={RouteNames.HOME} element={<Home />} />
                <Route path={RouteNames.EGOV} element={<Index />} />
            </Route>
            <Route path={RouteNames.DEV_TEST_SCREEN} element={<DevTestScreen />} />
        </Routes>
    )
}
