import React from 'react'
import { useParams } from 'react-router-dom'

import { CreateEntityView } from '@/components/views/egov/entity-detail-views/CreateEntityView'
import { ProfileDetailContainer } from '@/components/containers/Egov/Profile/ProfileDetailContainer'
import { CreateProfileContainer } from '@/components/containers/Egov/Profile/CreateProfileContainer'

const EditProfile = () => {
    const { entityId } = useParams()
    return (
        <ProfileDetailContainer
            entityName={entityId ?? ''}
            View={(props) => (
                <CreateProfileContainer
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

export default EditProfile