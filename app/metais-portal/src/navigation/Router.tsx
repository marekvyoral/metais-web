import * as React from 'react'
import { Route, Routes } from 'react-router'

import { TodoPage } from '@/components/views/todo-page/TodoPage'
import { RootRouteContainer } from '@/navigation/route-containers/RootRouteContainer'
import CIindex from '@/pages/ci'
import ProjektList from '@/pages/ci/Projekt'
import ProjectDetail from '@/pages/ci/Projekt/[entityId]'
import HelloIndex from '@/pages/ci/Projekt/[entityId]/hello'
import ProjectDetailindex from '@/pages/ci/Projekt/[entityId]/index'
import CiDetail from '@/pages/ci/[entityName]/[entityId]'
import CiDetailindex from '@/pages/ci/[entityName]/[entityId]/index'
import AhojIndex from '@/pages/ci/[entityName]/[entityId]/ahoj'
import Ahoj2Index from '@/pages/ci/[entityName]/[entityId]/ahoj2'

export const Router: React.FC = () => (
    <Routes>
        <Route path="/" element={<RootRouteContainer />}>
            <Route path="/ci" element={<CIindex />} />
            <Route path="/ci/:entityName" element={<CIindex />} />
            <Route path="/ci/:entityName/:entityId/" element={<CiDetail />}>
                <Route element={<CiDetailindex />} index />
                <Route path="hello" element={<AhojIndex />} />
                <Route path="hello2" element={<Ahoj2Index />} />
            </Route>

            <Route path="/ci/Projekt" element={<ProjektList />} />
            <Route path="/ci/Projekt/:entityId/" element={<ProjectDetail />}>
                <Route element={<ProjectDetailindex />} index />
                <Route path="hello" element={<HelloIndex />} />
                <Route path="hello2" element={<Ahoj2Index />} />
            </Route>

            <Route path="*" element={<TodoPage />} />
        </Route>
    </Routes>
)
