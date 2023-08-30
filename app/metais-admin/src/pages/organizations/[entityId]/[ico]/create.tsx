import React from 'react'

import { CreateOrganizationView } from '@/components/views/organizations/CreateOrganizationView'
import { CreateOrganizationContainer } from '@/components/containers/organizations/CreateOrganizationContainer'

const Create = () => {
    return (
        <CreateOrganizationContainer
            View={(props) => <CreateOrganizationView data={props?.data} storePO={props?.storePO} updatePO={props?.updatePO} />}
        />
    )
}

export default Create
