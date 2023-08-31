import { CreateProfileContainer } from '@/components/containers/Egov/Profile/CreateProfileContainer'
import { CreateEntityView } from '@/components/views/egov/entity-detail-views/CreateEntityView'

const CreateProfile = () => {
    return (
        <CreateProfileContainer View={(props) => <CreateEntityView data={props?.data} mutate={props?.mutate} hiddenInputs={props?.hiddenInputs} />} />
    )
}

export default CreateProfile
