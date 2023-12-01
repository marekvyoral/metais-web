import { useGetIdentityTerms } from '@isdd/metais-common/api/generated/iam-swagger'
import { IDENTITY_TERMS_ACCEPTED } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useUserInfo } from '@isdd/metais-common/hooks/useUserInfo'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import React, { Suspense, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce'
import { useLocation, useNavigate } from 'react-router-dom'

import { Router } from '@/navigation/Router'

export const App: React.FC = () => {
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user

    const { data: IdentityTermsData } = useGetIdentityTerms({ query: { enabled: isUserLogged } })
    const { logOut } = useContext<IAuthContext>(AuthContext)

    useUserInfo()

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (IdentityTermsData?.licenceTermsAccepted === false) {
            sessionStorage.setItem(IDENTITY_TERMS_ACCEPTED, 'false')
            navigate(RouterRoutes.IDENTITY_TERMS, { state: { from: location } })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [IdentityTermsData?.licenceTermsAccepted])

    useEffect(() => {
        if (sessionStorage.getItem(IDENTITY_TERMS_ACCEPTED) === 'false' && location.pathname !== RouterRoutes.IDENTITY_TERMS) {
            logOut()
            sessionStorage.removeItem(IDENTITY_TERMS_ACCEPTED)
        }
    }, [location, logOut])

    const { t } = useTranslation()
    document.title = `${t('titles.mainPage')} | MetaIS`
    return (
        <Suspense>
            <Router />
        </Suspense>
    )
}
