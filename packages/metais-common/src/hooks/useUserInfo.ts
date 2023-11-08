import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'

import { getUserInfo } from '@isdd/metais-common/api/userInfoApi'
import { USER_INFO_QUERY_KEY } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export const useUserInfo = () => {
    const { logOut, token, setUserInfo, userInfo: userInfoAuth } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const { data, isLoading, isError, error } = useQuery({
        queryKey: [USER_INFO_QUERY_KEY, token],
        queryFn: () => getUserInfo(token || ''),
        enabled: !!token && !userInfoAuth,
    })
    const userInfo = data?.data

    useEffect(() => {
        if (data?.statusCode === 401) {
            logOut()
            navigate('/?token_expired=true', { state: { from: location } })
        }
    }, [data?.statusCode, logOut, location, navigate])

    useEffect(() => {
        if (userInfo && data?.statusCode === 200) {
            setUserInfo?.(userInfo)
        }
    }, [userInfo, data?.statusCode, setUserInfo])

    return {
        userInfo,
        isLoading,
        isError,
        error,
    }
}
