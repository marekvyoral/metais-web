/* eslint-disable @typescript-eslint/no-unused-vars */
import { DetailRequestContainer } from '@/components/containers/DetailRequestContainer'
import { DetailRequestView } from '@/components/views/requestLists/DetailRequestView'

const DetailPage = () => {
    return (
        <DetailRequestContainer
            View={(props) => (
                <DetailRequestView
                    data={props.data}
                    actions={props.actions}
                    isLoading={props.isLoading}
                    isError={props.isError}
                    entityName={props.entityName}
                    attributeProfile={props.attributeProfile}
                    loadOptions={props.loadOptions}
                    requestId={props.requestId}
                    onAccept={props.onAccept}
                />
            )}
        />
    )
}

export default DetailPage
