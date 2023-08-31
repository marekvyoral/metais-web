import React from 'react'
import { useParams } from 'react-router-dom'

import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { CiCreateEntityContainer } from '@/components/containers/CiCreateEntityContainer'
import { PublicAuthorityAndRoleContainer } from '@/components/containers/PublicAuthorityAndRoleContainer'
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
                        <PublicAuthorityAndRoleContainer
                            View={({ data: groupData, roleState, publicAuthorityState }) => (
                                <CreateCiEntityView
                                    data={{ attributesData, generatedEntityId }}
                                    ownerId={groupData?.gid ?? ''}
                                    roleState={roleState}
                                    publicAuthorityState={publicAuthorityState}
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
