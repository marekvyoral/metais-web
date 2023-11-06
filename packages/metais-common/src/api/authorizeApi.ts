export const getAuthorizeToken = () => {
    const redirectUrl = window.location.href || window.location.protocol + '//' + window.location.host
    const baseUrl =
        import.meta.env.VITE_REST_CLIENT_IAM_OIDC_BASE_URL + (import.meta.env.VITE_IAM_OIDC_PATH ? `/${import.meta.env.VITE_IAM_OIDC_PATH}` : '')
    const url = `${baseUrl}/authorize?response_type=token&client_id=webPortalClient&redirect_uri=${redirectUrl}&scope=${encodeURIComponent(
        'openid profile c_ui',
    )}`

    // not work otherwise redirect blocked by cors
    location.assign(url)
}
