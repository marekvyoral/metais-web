import React from 'react'
import { Route, Routes } from 'react-router'

import { RootRouteContainer } from './route-containers/RootRouteContainer'

import { PreloginPage } from '@/pages/PreloginPage'
import { LoginPage } from '@/pages/LoginPage'
import { LoginProblemsPage } from '@/pages/LoginProblemsPage'
import { ErrorPage } from '@/pages/ErrorPage'
import { ForgottenPasswordPage } from '@/pages/ForgottenPasswordPage'

export enum LoginRouteNames {
    BASE = '/',
    PRE_LOGIN = '/prelogin',
    LOGIN = '/login',
    ERROR = '?error',
    NOT_MATCHED = '*',
    LOGIN_PROBLEMS = '/login-problems',
    FORGOTTEN_PASSWORD = '/forgotten-password',
}

export const Router: React.FC = () => (
    <Routes>
        <Route path={LoginRouteNames.BASE} element={<RootRouteContainer />}>
            <Route path={LoginRouteNames.PRE_LOGIN} element={<PreloginPage />} />
            <Route path={LoginRouteNames.LOGIN} element={<LoginPage />} />
            <Route path={LoginRouteNames.FORGOTTEN_PASSWORD} element={<ForgottenPasswordPage />} />
            <Route path={LoginRouteNames.LOGIN_PROBLEMS} element={<LoginProblemsPage />} />

            <Route path={LoginRouteNames.BASE} element={<ErrorPage />} />
            <Route path={LoginRouteNames.NOT_MATCHED} element={<ErrorPage />} />
        </Route>
    </Routes>
)
