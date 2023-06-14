import * as React from 'react'
import { Route, Routes } from 'react-router'

import { RootRouteContainer } from '@/navigation/route-containers/RootRouteContainer'
import { RouteNames } from '@/navigation/routeNames'
import { DevTestScreen } from '@/pages/DevTestScreen'
import { Home } from '@/pages/Home'
import { DocumentsListPage } from '@/pages/ci/[entityName]/[entityId]'
import ProjektListPage from '@/pages/projekt'
import ProjektEntityDetailPage from '@/pages/project/[id]'
import Relationships from '@/pages/ci/[entityName]/[entityId]/Relationships'

export const Router: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<RootRouteContainer />}>
                <Route path={RouteNames.HOME} element={<Home />} />
                <Route path={RouteNames.PROJEKT_LIST_PAGE} element={<ProjektListPage />} />
            </Route>
            <Route path={RouteNames.DEV_TEST_SCREEN} element={<DevTestScreen />} />
            <Route path={'/ci/:entityName/:entityId/documents'} element={<DocumentsListPage />} />
            <Route path={'/ci/:entityName/:entityId/relationships'} element={<Relationships />} />
            <Route path={RouteNames.PROJEKT_ENTITY_DETAIL} element={<ProjektEntityDetailPage />} />
        </Routes>
    )
}
