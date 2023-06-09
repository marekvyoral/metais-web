import * as React from 'react'
import { Route, Routes } from 'react-router'

import { RootRouteContainer } from '@portal/navigation/route-containers/RootRouteContainer'
import { RouteNames } from '@portal/navigation/routeNames'
import { DevTestScreen } from '@portal/pages/DevTestScreen'
import { Home } from '@portal/pages/Home'
import ProjektEntityDetailPage from '@portal/pages/project/[id]'

export const Router: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<RootRouteContainer />}>
                <Route path={RouteNames.HOME} element={<Home />} />
            </Route>
            <Route path={RouteNames.DEV_TEST_SCREEN} element={<DevTestScreen />} />
            <Route path={RouteNames.PROJEKT_ENTITY_DETAIL} element={<ProjektEntityDetailPage />} />
        </Routes>
    )
}
