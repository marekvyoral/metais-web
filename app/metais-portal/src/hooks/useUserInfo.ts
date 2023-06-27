import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import { AuthActions, useAuth } from '@/contexts/auth/authContext'
import { getUserInfo } from '@/api/userInfoApi'

export const useUserInfo = () => {
    const {
        state: { accessToken, user },
        dispatch,
    } = useAuth()
    const navigate = useNavigate()

    const { data, isLoading, isError, error } = useQuery({
        queryFn: () => getUserInfo(accessToken || ''),
        enabled: !!accessToken && !user,
    })
    const userInfo = data?.data

    useEffect(() => {
        if (data?.statusCode === 401) {
            dispatch({ type: AuthActions.LOGOUT })
            navigate('/?token_expired=true')
        }
    }, [data?.statusCode, dispatch, navigate])

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
