import { useParams } from 'react-router-dom'

import { CreateProfileContainer } from '@/components/containers/Egov/Profile/CreateProfileContainer'
import { ProfileDetailContainer } from '@/components/containers/Egov/Profile/ProfileDetailContainer'
import { CreateEntityView } from '@/components/views/egov/entity-detail-views/CreateEntityView'

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
                            mutate={props?.saveAttribute}
                            hiddenInputs={createProps?.hiddenInputs}
                        />
                    )}
                />
            )}
        />
    )
}

export default EditProfile
