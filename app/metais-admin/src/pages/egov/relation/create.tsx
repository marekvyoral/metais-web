import React from 'react'

import { CreateRelationContainer } from '@/components/containers/Egov/Relation/CreateRelationContainer'
import { CreateEntityView } from '@/components/views/egov/entity-detail-views/CreateEntityView'

const CreateRelation = () => {
    return (
        <CreateRelationContainer
            View={(props) => <CreateEntityView data={props?.data} mutate={props?.mutate} hiddenInputs={props?.hiddenInputs} />}
        />
    )
}

export default CreateRelation
