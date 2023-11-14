import { useContext, useState } from 'react'
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce'

export const useHandleLogout = () => {
    const { logOut } = useContext<IAuthContext>(AuthContext)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const logoutUser = async () => {
        const logoutURL =
            import.meta.env.VITE_REST_CLIENT_IAM_OIDC_BASE_URL +
            (import.meta.env.VITE_IAM_OIDC_PATH ? `/${import.meta.env.VITE_IAM_OIDC_PATH}/logout` : '/logout')

        setIsLoading(true)
        fetch(logoutURL, { method: 'POST', credentials: 'include' }).finally(() => {
            logOut()
            setIsLoading(false)
        })
    }

    return { logoutUser, isLoading }
}
