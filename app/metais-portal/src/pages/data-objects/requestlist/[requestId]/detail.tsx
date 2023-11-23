/* eslint-disable @typescript-eslint/no-unused-vars */
import { DetailRequestContainer } from '@/components/containers/DetailRequestContainer'
import { DetailRequestView } from '@/components/views/requestLists/DetailRequestView'

const RequestListDetailPage = () => {
    return (
        <DetailRequestContainer
            View={(props) => (
                <DetailRequestView
                    data={props.data}
                    isLoading={props.isLoading}
                    isLoadingMutation={props.isLoadingMutation}
                    actionsErrorMessages={props.actionsErrorMessages}
                    isError={props.isError}
                    requestId={props.requestId}
                    onAccept={props.onAccept}
                />
            )}
        />
    )
}

export default RequestListDetailPage
