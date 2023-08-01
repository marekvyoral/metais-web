import React from 'react'
import { useParams } from 'react-router-dom'

import { CreateEntityView } from '@/components/views/egov/entity-detail-views/CreateEntityView'
import { RelationDetailContainer } from '@/components/containers/Egov/Relation/RelationsDetailContainer'
import { CreateRelationContainer } from '@/components/containers/Egov/Relation/CreateRelationContainer'

const EditRelation = () => {
    const { entityId } = useParams()
    return (
        <RelationDetailContainer
            entityName={entityId ?? ''}
            View={(props) => (
                <CreateRelationContainer
                    View={(createProps) => (
                        <CreateEntityView
                            data={{
                                roles: createProps?.data?.roles,
                                existingEntityData: props?.data?.ciTypeData,
                            }}
                            mutate={createProps?.mutate}
                            hiddenInputs={createProps?.hiddenInputs}
                        />
                    )}
                />
            )}
        />
    )
}

export default EditRelation
