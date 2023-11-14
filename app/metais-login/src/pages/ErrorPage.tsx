import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { LoginRouteNames } from '@/navigation/Router'

export const ErrorPage = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate(LoginRouteNames.PRE_LOGIN)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return <></>
}
