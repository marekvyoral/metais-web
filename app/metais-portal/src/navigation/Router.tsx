import * as React from 'react'
import { Route, Routes } from 'react-router'

import { RootRouteContainer } from '@/navigation/route-containers/RootRouteContainer'
import { RouteNames } from '@/navigation/routeNames'
import { DevTestScreen } from '@/pages/DevTestScreen'
import { Home } from '@/pages/Home'
import { Documents } from '@/pages/ci/[entityName]/[entityId]/Documents'
import ProjektListPage from '@/pages/projekt'
import ProjektEntityDetailPage from '@/pages/project/[id]'

export const Router: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<RootRouteContainer />}>
                <Route path={RouteNames.HOME} element={<Home />} />
                <Route path={RouteNames.PROJEKT_LIST_PAGE} element={<ProjektListPage />} />
            </Route>
            <Route path={RouteNames.DEV_TEST_SCREEN} element={<DevTestScreen />} />
            <Route path={'Documents/:entityId'} element={<Documents />} />
            <Route path={RouteNames.PROJEKT_ENTITY_DETAIL} element={<ProjektEntityDetailPage />} />
        </Routes>
    )
}
