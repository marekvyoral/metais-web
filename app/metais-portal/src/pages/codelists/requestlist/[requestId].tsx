/* eslint-disable @typescript-eslint/no-unused-vars */
import { DetailRequestContainer } from '@/components/containers/DetailRequestContainer'
import DetailRequestView from '@/components/views/requestLists/DetailRequestView'

const DetailPage = () => {
    return <DetailRequestContainer View={(props) => <DetailRequestView isLoading={false} isError={false} />} />
}

export default DetailPage
