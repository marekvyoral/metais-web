import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'

import { getUserInfo } from '@isdd/metais-common/api/userInfoApi'
import { USER_INFO_QUERY_KEY } from '@isdd/metais-common/constants'
import { CustomAuthActions, useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export const useUserInfo = () => {
    const {
        state: {
            userInfo,
            userContext: { logOut, token },
        },
        dispatch,
    } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const { data, isLoading, isError, error } = useQuery({
        queryKey: [USER_INFO_QUERY_KEY, token],
        queryFn: () => getUserInfo(token || ''),
        enabled: !!token && !userInfo,
    })
    const userInfoData = data?.data

    useEffect(() => {
        if (data?.statusCode === 401) {
            logOut()
            navigate('/?token_expired=true', { state: { from: location } })
        }
    }, [data?.statusCode, logOut, location, navigate])

    useEffect(() => {
        if (userInfoData && data?.statusCode === 200) {
            dispatch({ type: CustomAuthActions.SET_USER_INFO, value: userInfoData })
        }
    }, [userInfoData, data?.statusCode, dispatch, data])

    return {
        userInfo,
        isLoading,
        isError,
        error,
    }
}
