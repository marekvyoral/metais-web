import React from 'react'
import { useParams } from 'react-router-dom'

import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { CiContainer } from '@/components/containers/CiContainer'
import { CiCreateEntityContainer } from '@/components/containers/CiCreateEntityContainer'
import { NewCiRelationContainer } from '@/components/containers/NewCiRelationContainer'
import { PublicAuthorityAndRoleContainer } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { NewCiWithRelationView } from '@/components/views/new-ci-with-relation/NewCiWithRelationView'

const CreateCiItemAndRelation: React.FC = () => {
    const { entityName, entityId, tabName } = useParams()

    return (
        <AttributesContainer
            entityName={entityName ?? ''}
            View={({ data: attributesData }) => (
                <CiContainer
                    configurationItemId={entityId}
                    View={({ data: ciData }) => (
                        <CiCreateEntityContainer
                            entityName={entityName ?? ''}
                            View={({ data: generatedEntityId }) => (
                                <NewCiRelationContainer
                                    entityName={entityName ?? ''}
                                    configurationItemId={entityId ?? ''}
                                    tabName={tabName ?? ''}
                                    View={({ data: relationData, selectedRelationTypeState }) => (
                                        <PublicAuthorityAndRoleContainer
                                            View={({ data: groupData, publicAuthorityState, roleState }) => (
                                                <NewCiWithRelationView
                                                    entityName={entityName ?? ''}
                                                    entityId={entityId ?? ''}
                                                    tabName={tabName ?? ''}
                                                    data={{
                                                        attributesData,
                                                        generatedEntityId,
                                                        relationData,
                                                        groupData,
                                                        ciItemData: ciData?.ciItemData,
                                                    }}
                                                    states={{ selectedRelationTypeState, publicAuthorityState, roleState }}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            )}
                        />
                    )}
                />
            )}
        />
    )
}

export default CreateCiItemAndRelation
