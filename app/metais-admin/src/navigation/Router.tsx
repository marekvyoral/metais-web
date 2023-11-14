import * as React from 'react'
import { Route, Routes } from 'react-router'

import { computedRoutes } from './fileBasedRoutes'

import { RootRouteContainer } from '@/navigation/route-containers/RootRouteContainer'
import { TodoPage } from '@/components/views/todo-page/TodoPage'

export const Router: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<RootRouteContainer />}>
                <Route>{computedRoutes()}</Route>
                <Route path="*" element={<TodoPage />} />
            </Route>
        </Routes>
    )
}
