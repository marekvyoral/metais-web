import * as React from 'react'
import { Route, Routes } from 'react-router'

import { computedRoutes } from './fileBasedRoutes'

import { TodoPage } from '@/components/views/todo-page/TodoPage'
import { RootRouteContainer } from '@/navigation/route-containers/RootRouteContainer'

export const Router: React.FC = () => (
    <Routes>
        <Route path="/" element={<RootRouteContainer />}>
            <Route>{computedRoutes()}</Route>
            <Route path="*" element={<TodoPage />} />
        </Route>
    </Routes>
)
