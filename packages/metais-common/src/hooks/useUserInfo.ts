import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'

import { AuthActions, useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { getUserInfo } from '@isdd/metais-common/api/userInfoApi'
import { USER_INFO_QUERY_KEY } from '@isdd/metais-common/constants'

export const useUserInfo = () => {
    const {
        state: { accessToken, user },
        dispatch,
    } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const { data, isLoading, isError, error } = useQuery({
        queryKey: [USER_INFO_QUERY_KEY, accessToken],
        queryFn: () => getUserInfo(accessToken || ''),
        enabled: !!accessToken && !user,
    })
    const userInfo = data?.data

    useEffect(() => {
        if (data?.statusCode === 401) {
            dispatch({ type: AuthActions.LOGOUT })
            navigate('/?token_expired=true', { state: { from: location } })
        }
    }, [data?.statusCode, dispatch, location, navigate])

    useEffect(() => {
        if (userInfo && data?.statusCode === 200) {
            dispatch({ type: AuthActions.SET_USER_INFO, value: userInfo })
        }
    }, [userInfo, dispatch, data?.statusCode])

    return {
        userInfo,
        isLoading,
        isError,
        error,
    }
}
