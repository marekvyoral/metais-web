import React from 'react'
import { OrgPermissionsWrapper } from '@isdd/metais-common/components/permissions/OrgPermissionsWrapper'

import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { CiCreateEntityContainer } from '@/components/containers/CiCreateEntityContainer'
import { PublicAuthorityAndRoleContainer } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { CreateCiEntityView } from '@/components/views/ci/create/CreateCiEntityView'

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
