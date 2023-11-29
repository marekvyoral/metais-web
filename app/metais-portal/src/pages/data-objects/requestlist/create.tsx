import { CreateRequestContainer } from '@/components/containers/CreateRequestContainer'
import { CreateRequestView } from '@/components/views/requestLists/CreateRequestView'

const RequestListCreatePage = () => {
    return <CreateRequestContainer View={(props) => <CreateRequestView {...props} />} />
}

export default RequestListCreatePage
