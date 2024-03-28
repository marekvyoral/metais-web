import { useContext, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce'
import { useNavigate } from 'react-router-dom'

import { CustomAuthActions, useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

export const useHandleLogout = () => {
    const { logOut } = useContext<IAuthContext>(AuthContext)
    const { dispatch } = useAuth()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const logoutUser = async () => {
        const logoutURL =
            import.meta.env.VITE_REST_CLIENT_IAM_OIDC_BASE_URL +
            (import.meta.env.VITE_IAM_OIDC_PATH ? `/${import.meta.env.VITE_IAM_OIDC_PATH}/logout` : '/logout')

        setIsLoading(true)
        fetch(logoutURL, { method: 'POST', credentials: 'include' })
            .then((response) => {
                if (!response.redirected) {
                    response.text().then((html) => {
                        document.open()
                        document.write(html)
                        document.close()
                    })
                }
            })
            .finally(() => {
                logOut()
                dispatch({ type: CustomAuthActions.LOGOUT_USER })
                queryClient.clear()
                setIsLoading(false)
                navigate(AdminRouteNames.HOME)
            })
    }

    return { logoutUser, isLoading }
}
