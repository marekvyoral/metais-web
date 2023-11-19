import ProtectedRoute from '@isdd/metais-common/fileBasedRouting/ProtectedRoute'
import * as React from 'react'
import { Route, Routes } from 'react-router'

import { RouteConfig, routesConfig } from './routesConfig'

const generateRoutes = (routes: RouteConfig[], subRoute = false, level = 0) =>
    routes.map((route, index) =>
        route.subRoutes ? (
            <Route
                key={subRoute ? `subRoute_${level}_${index}` : `route_${level}_${index}`}
                path={route.path}
                element={<ProtectedRoute element={<route.component />} slug={route.slug} />}
            >
                {generateRoutes(route.subRoutes, true, level + 1)}
            </Route>
        ) : (
            <Route
                key={subRoute ? `subRoute_${level}_${index}` : `route_${level}_${index}`}
                path={route.path}
                element={<ProtectedRoute element={<route.component />} slug={route.slug} />}
                index={!!route.index}
            />
        ),
    )

export const Router: React.FC = () => <Routes>{generateRoutes(routesConfig)}</Routes>
