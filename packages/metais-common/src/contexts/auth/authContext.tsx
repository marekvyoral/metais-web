import React, { useContext, useState, useMemo } from 'react'
import { AuthProvider, TAuthConfig, AuthContext, IAuthContext } from 'react-oauth2-code-pkce'

export interface Role {
    gid: string
    roleDescription: string
    roleName: string
    roleUuid: string
    roleWeight: number
}

export interface Group {
    orgId: string
    roles: Role[]
}

export interface User {
    login: string
    displayName: string
    firstName: string
    lastName: string
    state: string
    position: string
    uuid: string
    name: string
    preferred_username: string
    authenticationResource: string
    email: string
    phone: string
    roles: string[]
    groupData: Group[]
}

export interface ICustomAuthContext extends IAuthContext {
    userInfo?: User
    setUserInfo?: (user: User) => void
}

const baseUrl =
    import.meta.env.VITE_REST_CLIENT_IAM_OIDC_BASE_URL + (import.meta.env.VITE_IAM_OIDC_PATH ? `/${import.meta.env.VITE_IAM_OIDC_PATH}` : '')

const authConfig: TAuthConfig = {
    clientId: 'webPortalClient2',
    extraAuthParameters: { response_type: 'code' },
    authorizationEndpoint: baseUrl + '/authorize',
    tokenEndpoint: baseUrl + '/token',
    redirectUri: window.location.protocol + '//' + window.location.host + '/',
    scope: 'openid profile c_ui',
    autoLogin: false,
}

const AuthContextProvider: React.FC<React.PropsWithChildren> = (props) => {
    return <AuthProvider authConfig={authConfig}>{props.children}</AuthProvider>
}

const useAuth = () => {
    const [userInfo, setUserInfo] = useState<User>()
    const defContext = useContext<ICustomAuthContext>(AuthContext)

    const extendedContext = useMemo(
        () => ({
            ...defContext,
            setUserInfo,
            userInfo,
        }),
        [defContext, userInfo],
    )

    return extendedContext
}

export { AuthContextProvider, useAuth }
