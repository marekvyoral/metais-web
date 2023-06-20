import * as React from 'react'
import { Route, Routes } from 'react-router'

import { Login } from '@/pages/Login'
import { RootRouteContainer } from '@/navigation/route-containers/RootRouteContainer'
import { RouteNames } from '@/navigation/routeNames'
import { DevTestScreen } from '@/pages/DevTestScreen'
import { Home } from '@/pages/Home'
import ProjektListPage from '@/pages/projekt'
import RelationshipsAccordionPage from '@/pages/ci/[entityName]/[entityId]/relationships'
import InformationsListPage from '@/pages/ci/[entityName]/[entityId]/informations'
import DocumentsListPage from '@/pages/ci/[entityName]/[entityId]/documents'
import ConfigurationItemListPage from '@/pages/ci/[entityName]/index'
import ConfigurationItemDetailPage from '@/pages/ci/[entityName]/[entityId]'

export const Router: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<RootRouteContainer />}>
                <Route path={RouteNames.HOME} element={<Home />} />
                <Route path={RouteNames.PROJEKT_LIST_PAGE} element={<ProjektListPage />} />
                <Route path={RouteNames.CONFIGURATION_ITEM_LIST} element={<ConfigurationItemListPage />} />
                <Route path={RouteNames.CONFIGURATION_ITEM_DETAIL} element={<ConfigurationItemDetailPage />} />
                <Route path={RouteNames.CONFIGURATION_ITEM_DETAIL} element={<ConfigurationItemDetailPage />}>
                    <Route element={<InformationsListPage />} index />
                    <Route path="documents" element={<DocumentsListPage />} />
                    <Route path="relationships" element={<RelationshipsAccordionPage />} />
                </Route>
                <Route path={RouteNames.LOGIN} element={<Login />} />
            </Route>
            <Route path={RouteNames.DEV_TEST_SCREEN} element={<DevTestScreen />} />
        </Routes>
    )
}
