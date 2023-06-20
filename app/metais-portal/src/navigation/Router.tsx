import * as React from 'react'
import { Route, Routes } from 'react-router'

import { RootRouteContainer } from '@/navigation/route-containers/RootRouteContainer'
import { RouteNames } from '@/navigation/routeNames'
import { DevTestScreen } from '@/pages/DevTestScreen'
import { Home } from '@/pages/Home'
import ProjektListPage from '@/pages/projekt'
import ProjektEntityDetailPage from '@/pages/ci/[entityName]/[id]'
import RelationshipsAccordionPage from '@/pages/ci/[entityName]/[entityId]/relationships'
import DocumentsListPage from '@/pages/ci/[entityName]/[entityId]/documents'
import { Login } from '@/pages/Login'

export const Router: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<RootRouteContainer />}>
                <Route path={RouteNames.HOME} element={<Home />} />
                <Route path={RouteNames.PROJEKT_ENTITY_DETAIL} element={<ProjektEntityDetailPage />} />
                <Route path={RouteNames.PROJEKT_LIST_PAGE} element={<ProjektListPage />} />
                <Route path={RouteNames.DOCUMENTS_LIST_TAB} element={<DocumentsListPage />} />
                <Route path={RouteNames.RELATIONSHIPS_LIST_TAB} element={<RelationshipsAccordionPage />} />
                <Route path={RouteNames.LOGIN} element={<Login />} />
            </Route>
            <Route path={RouteNames.DEV_TEST_SCREEN} element={<DevTestScreen />} />
        </Routes>
    )
}
