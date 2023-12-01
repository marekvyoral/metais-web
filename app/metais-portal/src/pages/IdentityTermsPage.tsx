import React from 'react'

import { IdentityTermsContainer } from '@/components/containers/IdentityTermsContainer'
import { IdentityTermsView } from '@/components/views/IdentityTermsConfirmation/IdentityTermsView'

export const IdentityTermsPage: React.FC = () => {
    return <IdentityTermsContainer View={(props) => <IdentityTermsView {...props} />} />
}
