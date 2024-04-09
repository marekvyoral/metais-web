import { LoadingIndicator } from '@isdd/idsk-ui-kit/src/loading-indicator/LoadingIndicator'
import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { Actions, CANNOT_READ_ENTITY, CAN_CREATE_WITHOUT_LOGIN } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'

interface iProtectedRoute {
    element: JSX.Element
    slug?: string
    isAdmin?: boolean
}

enum AUTHORIZATION_STATUS {
    UNKNOWN = 'unknown',
    AUTHORIZED = 'authorized',
    UNAUTHORIZED = 'unauthorized',
}

const ProtectedRoute = ({ element, slug, isAdmin }: iProtectedRoute) => {
    const [authorizationStatus, setAuthorizationStatus] = useState<AUTHORIZATION_STATUS>(AUTHORIZATION_STATUS.UNKNOWN)
    const { isLoadingUserPreferences } = useUserPreferences()
    const {
        state: { token },
    } = useAuth()
    const actions = Object.values(Actions)
    const selectedAbility = actions?.find((action) => slug?.includes(action))
    const isUserLogged = !!token
    const isCannotReadPage = CANNOT_READ_ENTITY?.some((entity) => slug?.includes(entity))
    const isCanWithoutLogin = CAN_CREATE_WITHOUT_LOGIN.some((entity) => slug?.includes(entity))

    useEffect(() => {
        const isUnauthorized =
            (isAdmin && !isUserLogged && slug !== 'Home') ||
            (!isUserLogged && selectedAbility && !isCanWithoutLogin) ||
            (!isUserLogged && isCannotReadPage)
        setAuthorizationStatus(isUnauthorized ? AUTHORIZATION_STATUS.UNAUTHORIZED : AUTHORIZATION_STATUS.AUTHORIZED)
    }, [isUserLogged, selectedAbility, isCannotReadPage, isCanWithoutLogin, isAdmin, slug])

    if (authorizationStatus === AUTHORIZATION_STATUS.UNKNOWN || isLoadingUserPreferences) return <LoadingIndicator fullscreen />
    if (authorizationStatus === AUTHORIZATION_STATUS.UNAUTHORIZED) return <Navigate to={'/'} />
    return element
}

export default ProtectedRoute
