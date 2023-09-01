import React from 'react'
import { useParams } from 'react-router-dom'

import { CreateOrganizationContainer } from '@/components/containers/organizations/CreateOrganizationContainer'
import { CreateOrganizationView } from '@/components/views/organizations/CreateOrganizationView'
import { OrganizationsDetailContainer } from '@/components/containers/organizations/OrganizationsDetailContainer'

const Edit = () => {
    const { entityId } = useParams()
    return (
        <OrganizationsDetailContainer
            entityId={entityId ?? ''}
            View={(orgProps) => (
                <CreateOrganizationContainer
                    View={(props) => (
                        <CreateOrganizationView
                            data={{
                                ...props?.data,
                                organizationData: orgProps?.data?.configurationItem,
                            }}
                            storePO={props?.storePO}
                            updatePO={props?.updatePO}
                        />
                    )}
                />
            )}
        />
    )
}

export default Edit
