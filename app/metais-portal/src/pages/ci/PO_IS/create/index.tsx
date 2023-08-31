import React from 'react'

import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { CiCreateEntityContainer } from '@/components/containers/CiCreateEntityContainer'
import { PublicAuthorityAndRoleContainer } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { CreateEntity } from '@/components/create-entity/CreateEntity'

const CreateEntityPage: React.FC = () => {
    const entityName = 'PO'

    return (
        <AttributesContainer
            entityName={entityName ?? ''}
            View={({ data: attributesData }) => (
                <CiCreateEntityContainer
                    entityName={entityName ?? ''}
                    View={({ data: generatedEntityId }) => (
                        <PublicAuthorityAndRoleContainer
                            View={({ roleState, publicAuthorityState, data: groupData }) => (
                                <CreateEntity
                                    roleState={roleState}
                                    publicAuthorityState={publicAuthorityState}
                                    data={{ attributesData, generatedEntityId, ownerId: groupData?.gid }}
                                    entityName={entityName ?? ''}
                                />
                            )}
                        />
                    )}
                />
            )}
        />
    )
}

export default CreateEntityPage
