import { CreateRequestContainer } from '@/components/containers/CreateRequestContainer'
import { CreateRequestView } from '@/components/views/requestLists/CreateRequestView'

const RequestListCreatePage = () => {
    return (
        <CreateRequestContainer
            View={(props) => (
                <CreateRequestView
                    canEdit={props.canEdit}
                    canEditDate={props.canEditDate}
                    isError={props.isError}
                    errorMessages={props.errorMessages}
                    isLoadingMutation={props.isLoadingMutation}
                    isLoading={props.isLoading}
                    firstNotUsedCode={props.firstNotUsedCode}
                    onHandleCheckIfCodeIsAvailable={props.onHandleCheckIfCodeIsAvailable}
                    loadOptions={props.loadOptions}
                    onSave={props.onSave}
                    onSend={props.onSend}
                    attributeProfile={props.attributeProfile}
                />
            )}
        />
    )
}

export default RequestListCreatePage
