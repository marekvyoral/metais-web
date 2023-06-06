import * as React from 'react'
import { Route, Routes } from 'react-router'

import { RootRouteContainer } from '@/navigation/route-containers/RootRouteContainer'
import { RouteNames } from '@/navigation/routeNames'
import { DevTestScreen } from '@/pages/DevTestScreen'
import { Home } from '@/pages/Home'
import { Index } from '@/pages/egov'

export const Router: React.FC = () => {
    return (
        <Routes>
            <Route path="/egov" element={<RootRouteContainer />}>
                <Route path={RouteNames.HOME} element={<Home />} />
                <Route path={RouteNames.EGOV} element={<Index />} />
            </Route>
            <Route path={RouteNames.DEV_TEST_SCREEN} element={<DevTestScreen />} />
        </Routes>
    )
}
