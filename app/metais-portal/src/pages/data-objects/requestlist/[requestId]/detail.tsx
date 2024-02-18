/* eslint-disable @typescript-eslint/no-unused-vars */

import { DetailRequestContainer } from '@/components/containers/DetailRequestContainer'
import { DetailRequestView } from '@/components/views/requestLists/DetailRequestView'

const RequestListDetailPage = () => {
    return <DetailRequestContainer View={(props) => <DetailRequestView {...props} />} />
}

export default RequestListDetailPage
