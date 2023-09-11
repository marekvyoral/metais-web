import React from 'react'
import { useParams } from 'react-router-dom'
import { OrgPermissionsWrapper } from '@isdd/metais-common/components/permissions/OrgPermissionsWrapper'

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
                                <OrgPermissionsWrapper selectedOrganizationId={publicAuthorityState?.selectedPublicAuthority?.poUUID ?? ''}>
                                    <CreateCiEntityView
                                        data={{ attributesData, generatedEntityId }}
                                        ownerId={groupData?.gid ?? ''}
                                        roleState={roleState}
                                        publicAuthorityState={publicAuthorityState}
                                        entityName={entityName ?? ''}
                                    />
                                </OrgPermissionsWrapper>
                            )}
                        />
                    )}
                />
            )}
        />
    )
}

export default CreateEntityPage
