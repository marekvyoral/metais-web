import { EditRequestContainer } from '@/components/containers/EditRequestContainer'
import { CreateRequestView } from '@/components/views/requestLists/CreateRequestView'

const RequestListEditPage = () => {
    return (
        <EditRequestContainer
            View={(props) => (
                <CreateRequestView
                    canEdit={props.canEdit}
                    canEditDate={props.canEditDate}
                    isError={props.isError}
                    errorMessages={props.errorMessages}
                    isLoading={props.isLoading}
                    isLoadingMutation={props.isLoadingMutation}
                    firstNotUsedCode={props.firstNotUsedCode}
                    onHandleCheckIfCodeIsAvailable={props.onHandleCheckIfCodeIsAvailable}
                    loadOptions={props.loadOptions}
                    onSave={props.onSave}
                    onSend={props.onSend}
                    editData={props.editData}
                    attributeProfile={props.attributeProfile}
                    onSaveDates={props.onSaveDates}
                    requestId={props.requestId}
                />
            )}
        />
    )
}

export default RequestListEditPage
