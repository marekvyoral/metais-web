import * as React from 'react'
import { Route, Routes } from 'react-router'

import { RootRouteContainer } from '@/navigation/route-containers/RootRouteContainer'
import { RouteNames } from '@/navigation/routeNames'
import { DevTestScreen } from '@/pages/DevTestScreen'
import { Home } from '@/pages/Home'
import ProjektListPage from '@/pages/projekt'
import ProjektEntityDetailPage from '@/pages/projekt/[id]'
import ConfigurationItemListPage from '@/pages/ci/[entityName]/index'
import ConfigurationItemDetailPage from '@/pages/ci/[entityName]/[entityId]'
import DocumentsListPage from '@/pages/ci/[entityName]/[entityId]/documents'
import RelationshipsAccordionPage from '@/pages/ci/[entityName]/[entityId]/relationships'

export const Router: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<RootRouteContainer />}>
                <Route path={RouteNames.HOME} element={<Home />} />
                <Route path={RouteNames.PROJEKT_LIST_PAGE} element={<ProjektListPage />} />
                <Route path={RouteNames.PROJEKT_ENTITY_DETAIL} element={<ProjektEntityDetailPage />} />
                <Route path={RouteNames.CONFIGURATION_ITEM_LIST} element={<ConfigurationItemListPage />} />
                <Route path={RouteNames.CONFIGURATION_ITEM_DETAIL} element={<ConfigurationItemDetailPage />} />
                <Route path={RouteNames.DOCUMENTS_LIST_TAB} element={<DocumentsListPage />} />
                <Route path={RouteNames.RELATIONSHIPS_LIST_TAB} element={<RelationshipsAccordionPage />} />
            </Route>
            <Route path={RouteNames.DEV_TEST_SCREEN} element={<DevTestScreen />} />
        </Routes>
    )
}
