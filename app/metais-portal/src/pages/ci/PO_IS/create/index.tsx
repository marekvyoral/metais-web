import React from 'react'

import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { CreateEntity } from '@/components/create-entity/CreateEntity'
import { CiCreateEntityContainer } from '@/components/containers/CiCreateEntityContainer'

const CreateEntityPage: React.FC = () => {
    const entityName = 'PO'

    return (
        <AttributesContainer
            entityName={entityName ?? ''}
            View={({ data: attributesData }) => (
                <CiCreateEntityContainer
                    entityName={entityName ?? ''}
                    View={({ data: generatedEntityId }) => (
                        <CreateEntity data={{ attributesData, generatedEntityId }} entityName={entityName ?? ''} />
                    )}
                />
            )}
        />
    )
}

export default CreateEntityPage
