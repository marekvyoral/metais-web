import { TAuthConfig } from 'react-oauth2-code-pkce'

interface AuthConfig {
    clientId: string
    scope: string
    redirectUri?: string
}

const PRE_LOGIN_PATH = 'preLoginPath'

const baseUrl =
    import.meta.env.VITE_REST_CLIENT_IAM_OIDC_BASE_URL + (import.meta.env.VITE_IAM_OIDC_PATH ? `/${import.meta.env.VITE_IAM_OIDC_PATH}` : '')

export const authConfig: (props: AuthConfig) => TAuthConfig = ({ clientId, scope, redirectUri = '' }: AuthConfig) => ({
    clientId,
    scope,
    extraAuthParameters: { response_type: 'code' },
    authorizationEndpoint: baseUrl + '/authorize',
    tokenEndpoint: baseUrl + '/token',
    redirectUri: window.location.protocol + '//' + window.location.host + redirectUri,
    autoLogin: false,
    preLogin: () => localStorage.setItem(PRE_LOGIN_PATH, window.location.pathname),
    postLogin: () => {
        window.location.replace(localStorage.getItem(PRE_LOGIN_PATH) || '')
        localStorage.removeItem(PRE_LOGIN_PATH)
    },
})
