import React from 'react'
import { useParams } from 'react-router-dom'

import { EntityDetailContainer } from '@/components/containers/Egov/Entity/EntityDetailContainer'
import { CreateEntityView } from '@/components/views/egov/entity-detail-views/CreateEntityView'
import CreateEntityContainer from '@/components/containers/Egov/Entity/CreateEntityContainer'

const EditEntity = () => {
    const { entityId } = useParams()
    return (
        <EntityDetailContainer
            entityName={entityId ?? ''}
            View={(props) => (
                <CreateEntityContainer
                    View={(createProps) => (
                        <CreateEntityView
                            existingEntityData={props?.data?.ciTypeData}
                            data={createProps?.data}
                            mutate={createProps?.mutate}
                            hiddenInputs={createProps?.hiddenInputs}
                        />
                    )}
                />
            )}
        />
    )
}

export default EditEntity
