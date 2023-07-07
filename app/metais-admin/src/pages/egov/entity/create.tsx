import React from 'react'

import CreateEntityContainer from '@/components/containers/Egov/Entity/CreateEntityContainer'
import { CreateEntityView } from '@/components/views/egov/entity-detail-views/CreateEntityView'

const CreateEntity = () => {
    return (
        <CreateEntityContainer View={(props) => <CreateEntityView data={props?.data} mutate={props?.mutate} hiddenInputs={props?.hiddenInputs} />} />
    )
}

export default CreateEntity
