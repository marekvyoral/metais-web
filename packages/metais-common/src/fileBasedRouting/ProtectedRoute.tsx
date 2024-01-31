import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { Actions, CANNOT_READ_ENTITY, CAN_CREATE_WITHOUT_LOGIN } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

interface iProtectedRoute {
    element: JSX.Element
    slug?: string
    isAdmin?: boolean
}

const ProtectedRoute = ({ element, slug, isAdmin }: iProtectedRoute) => {
    const [notAuthorized, setNotAuthorized] = useState(false)
    const navigate = useNavigate()
    const {
        state: { token },
    } = useAuth()
    const actions = Object.values(Actions)
    const selectedAbility = actions?.find((action) => slug?.includes(action))
    const isUserLogged = !!token
    const isCannotReadPage = CANNOT_READ_ENTITY?.some((entity) => slug?.includes(entity))
    const isCanWithoutLogin = CAN_CREATE_WITHOUT_LOGIN.some((entity) => slug?.includes(entity))

    useEffect(() => {
        if (isAdmin && !isUserLogged && slug !== 'Home') {
            setNotAuthorized(true)
        } else if (!isUserLogged && selectedAbility && !isCanWithoutLogin) setNotAuthorized(true)
        else if (!isUserLogged && isCannotReadPage) setNotAuthorized(true)
        else setNotAuthorized(false)
    }, [isUserLogged, navigate, selectedAbility, isCannotReadPage, setNotAuthorized, isCanWithoutLogin, isAdmin, slug])

    if (notAuthorized) return <Navigate to={'/'} />

    return element
}

export default ProtectedRoute
