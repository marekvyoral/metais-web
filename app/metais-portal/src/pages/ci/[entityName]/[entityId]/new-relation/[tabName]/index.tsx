import React from 'react'
import { useParams } from 'react-router-dom'

import { CiContainer } from '@/components/containers/CiContainer'
import { NewCiRelationContainer } from '@/components/containers/NewCiRelationContainer'
import { PublicAuthorityAndRoleContainer } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { NewRelationView } from '@/components/views/new-relation/NewRelationView'

const NewCiRelationPage: React.FC = () => {
    const { entityId, entityName, tabName } = useParams()

    return (
        <CiContainer
            configurationItemId={entityId}
            View={({ data: ciData }) => (
                <NewCiRelationContainer
                    entityName={entityName ?? ''}
                    configurationItemId={entityId ?? ''}
                    tabName={tabName ?? ''}
                    View={({ data: relationData, selectedRelationTypeState }) => (
                        <PublicAuthorityAndRoleContainer
                            View={({ data: groupData, publicAuthorityState, roleState }) => (
                                <NewRelationView
                                    roleState={roleState}
                                    publicAuthorityState={publicAuthorityState}
                                    ownerGid={groupData?.gid ?? ''}
                                    ciItemData={ciData?.ciItemData}
                                    relationData={relationData}
                                    selectedRelationTypeState={selectedRelationTypeState}
                                    tabName={tabName ?? ''}
                                    entityId={entityId ?? ''}
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

export default NewCiRelationPage
