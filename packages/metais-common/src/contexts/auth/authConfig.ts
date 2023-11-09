import { TAuthConfig } from 'react-oauth2-code-pkce'

const baseUrl =
    import.meta.env.VITE_REST_CLIENT_IAM_OIDC_BASE_URL + (import.meta.env.VITE_IAM_OIDC_PATH ? `/${import.meta.env.VITE_IAM_OIDC_PATH}` : '')

export const authConfig: (redirectUri?: string) => TAuthConfig = (redirectUri = '') => ({
    clientId: 'webPortalClient',
    extraAuthParameters: { response_type: 'code' },
    authorizationEndpoint: baseUrl + '/authorize',
    tokenEndpoint: baseUrl + '/token',
    redirectUri: window.location.protocol + '//' + window.location.host + redirectUri,
    scope: 'openid profile c_ui',
    autoLogin: false,
})
