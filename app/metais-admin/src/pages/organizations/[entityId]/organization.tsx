import React from 'react'
import { useParams } from 'react-router-dom'

import { OrganizationsDetailContainer } from '@/components/containers/organizations/OrganizationsDetailContainer'
import OrganizationsDetailView from '@/components/views/organizations/OrganizationsDetailView'

const Organization = () => {
    const { entityId } = useParams()
    return <OrganizationsDetailContainer entityId={entityId ?? ''} View={(props) => <OrganizationsDetailView {...props.data} />} />
}

export default Organization
