import { useGetIdentityTerms } from '@isdd/metais-common/api/generated/iam-swagger'
import { CustomAuthActions, useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useUserInfo } from '@isdd/metais-common/hooks/useUserInfo'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useContext, useEffect } from 'react'
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce'
import { useLocation, useNavigate } from 'react-router-dom'

export const useIdentityTerms = () => {
    const {
        state: { user, identityTermsAccepted },
        dispatch,
    } = useAuth()
    const isUserLogged = !!user

    const { data: IdentityTermsData } = useGetIdentityTerms({ query: { enabled: isUserLogged } })
    const { logOut } = useContext<IAuthContext>(AuthContext)

    useUserInfo()

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (IdentityTermsData?.licenceTermsAccepted === false) {
            dispatch({ type: CustomAuthActions.SET_IDENTITY_TERMS, identityTerms: false })
            navigate(RouterRoutes.IDENTITY_TERMS, { state: { from: location } })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [IdentityTermsData?.licenceTermsAccepted])

    useEffect(() => {
        if (identityTermsAccepted === false && location.pathname !== RouterRoutes.IDENTITY_TERMS) {
            logOut()
        }
    }, [identityTermsAccepted, location, logOut])
}
