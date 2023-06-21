export const getAuthorizeToken = () => {
    const redirectUrl = window.location.origin || window.location.protocol + '//' + window.location.host
    const url = `http://iam-oidc-metais3.apps.dev.isdd.sk/authorize?response_type=token&client_id=webPortalClient&redirect_uri=${redirectUrl}&scope=${encodeURIComponent(
        'openid profile c_ui',
    )}`

    // not work otherwise redirect blocked by cors
    location.assign(url)
}
