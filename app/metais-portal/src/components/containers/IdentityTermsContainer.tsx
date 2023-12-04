import { useChangeIdentityTerms } from '@isdd/metais-common/api/generated/iam-swagger'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomAuthActions, useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { MainContentWrapper } from '../MainContentWrapper'

import { IIdentityTermsView } from '@/components/views/IdentityTermsConfirmation/IdentityTermsView'

interface IIdentityTermsContainer {
    View: React.FC<IIdentityTermsView>
}

export const IdentityTermsContainer: React.FC<IIdentityTermsContainer> = ({ View }) => {
    const { dispatch } = useAuth()

    const { isLoading, isError, mutateAsync: changeIdentityTermsAsyncMutation } = useChangeIdentityTerms()

    const navigate = useNavigate()

    const confirmIdentityTerms = () =>
        changeIdentityTermsAsyncMutation({
            data: { licenceTermsAccepted: true },
        }).then(() => {
            dispatch({ type: CustomAuthActions.SET_IDENTITY_TERMS, identityTerms: true })
            navigate(RouterRoutes.HOME)
        })

    return (
        <MainContentWrapper noSideMenu>
            <View confirmIdentityTerms={confirmIdentityTerms} isError={isError} isLoading={isLoading} />
        </MainContentWrapper>
    )
}
