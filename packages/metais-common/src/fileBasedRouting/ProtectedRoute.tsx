import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { Actions, CANNOT_READ_ENTITY } from '@isdd/metais-common/hooks/permissions/useUserAbility'

interface iProtectedRoute {
    element: JSX.Element
    slug: string
}

const ProtectedRoute = ({ element, slug }: iProtectedRoute) => {
    const [notAuthorized, setNotAuthorized] = useState(false)
    const navigate = useNavigate()
    const auth = useAuth()
    const actions = Object.values(Actions)
    const selectedAbility = actions?.find((action) => slug.includes(action))
    const isUserLogged = !!auth?.state?.accessToken
    const isCannotReadPage = CANNOT_READ_ENTITY?.some((entity) => slug.includes(entity))

    useEffect(() => {
        if (!isUserLogged && selectedAbility) setNotAuthorized(true)
        else if (!isUserLogged && isCannotReadPage) setNotAuthorized(true)
        else setNotAuthorized(false)
    }, [isUserLogged, navigate, selectedAbility, isCannotReadPage, setNotAuthorized, auth])

    if (notAuthorized) return <Navigate to={'/home'} />

    return element
}

export default ProtectedRoute
