import { useContext, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce'

import { getUserInfo } from '@isdd/metais-common/api/userInfoApi'
import { USER_INFO_QUERY_KEY } from '@isdd/metais-common/constants'
import { CustomAuthActions, useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export const useUserInfo = () => {
    const {
        state: { user, token },
        dispatch,
    } = useAuth()
    const { logOut } = useContext<IAuthContext>(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()

    const { data, isLoading, isError, error } = useQuery({
        queryKey: [USER_INFO_QUERY_KEY, token],
        queryFn: () => getUserInfo(token || ''),
        enabled: !!token && !user,
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
        user,
        isLoading,
        isError,
        error,
    }
}
