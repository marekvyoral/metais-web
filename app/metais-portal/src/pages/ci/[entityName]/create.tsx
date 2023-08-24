import React from 'react'
import { useParams } from 'react-router-dom'

import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { CiCreateEntityContainer } from '@/components/containers/CiCreateEntityContainer'
import { CreateCiEntityView } from '@/components/views/ci/create/CreateCiEntityView'

const CreateEntityPage: React.FC = () => {
    const { entityName } = useParams()

    return (
        <AttributesContainer
            entityName={entityName ?? ''}
            View={({ data: attributesData }) => (
                <CiCreateEntityContainer
                    entityName={entityName ?? ''}
                    View={({ data: generatedEntityId }) => (
                        <CreateCiEntityView data={{ attributesData, generatedEntityId }} entityName={entityName ?? ''} />
                    )}
                />
            )}
        />
    )
}

export default CreateEntityPage
