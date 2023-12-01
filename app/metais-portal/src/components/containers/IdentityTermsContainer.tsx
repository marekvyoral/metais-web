import { useChangeIdentityTerms } from '@isdd/metais-common/api/generated/iam-swagger'
import { IDENTITY_TERMS_ACCEPTED } from '@isdd/metais-common/constants'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { MainContentWrapper } from '../MainContentWrapper'

import { IIdentityTermsView } from '@/components/views/IdentityTermsConfirmation/IdentityTermsView'

interface IIdentityTermsContainer {
    View: React.FC<IIdentityTermsView>
}

export const IdentityTermsContainer: React.FC<IIdentityTermsContainer> = ({ View }) => {
    const { isLoading, isError, mutateAsync: changeIdentityTermsAsyncMutation } = useChangeIdentityTerms()

    const navigate = useNavigate()

    const confirmIdentityTerms = () =>
        changeIdentityTermsAsyncMutation({
            data: { licenceTermsAccepted: true },
        }).then(() => {
            sessionStorage.removeItem(IDENTITY_TERMS_ACCEPTED)
            navigate(RouterRoutes.HOME)
        })

    return (
        <MainContentWrapper noSideMenu>
            <View confirmIdentityTerms={confirmIdentityTerms} isError={isError} isLoading={isLoading} />
        </MainContentWrapper>
    )
}
