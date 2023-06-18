import * as React from 'react'
import { Route, Routes } from 'react-router'

import { RootRouteContainer } from '@/navigation/route-containers/RootRouteContainer'
import { RouteNames } from '@/navigation/routeNames'
import { DevTestScreen } from '@/pages/DevTestScreen'
import { Home } from '@/pages/Home'
import ProjektListPage from '@/pages/projekt'
import ProjektEntityDetailPage from '@/pages/project/[id]'
import RelationshipsAccordionPage from '@/pages/ci/[entityName]/[entityId]/relationships'
import DocumentsListPage from '@/pages/ci/[entityName]/[entityId]/documents'

export const Router: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<RootRouteContainer />}>
                <Route path={RouteNames.HOME} element={<Home />} />
                <Route path={RouteNames.PROJEKT_LIST_PAGE} element={<ProjektListPage />} />
            </Route>
            <Route path={RouteNames.DEV_TEST_SCREEN} element={<DevTestScreen />} />
            <Route path={RouteNames.DOCUMENTS_LIST_TAB} element={<DocumentsListPage />} />
            <Route path={RouteNames.RELATIONSHIPS_LIST_TAB} element={<RelationshipsAccordionPage />} />
            <Route path={RouteNames.PROJEKT_ENTITY_DETAIL} element={<ProjektEntityDetailPage />} />
        </Routes>
    )
}
