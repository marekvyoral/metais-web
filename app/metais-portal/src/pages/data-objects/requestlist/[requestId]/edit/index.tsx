import { EditRequestContainer } from '@/components/containers/EditRequestContainer'
import { CreateRequestView } from '@/components/views/requestLists/CreateRequestView'

const RequestListEditPage = () => {
    return <EditRequestContainer View={(props) => <CreateRequestView {...props} />} />
}

export default RequestListEditPage
