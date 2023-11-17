import { CreateRequestContainer } from '@/components/containers/CreateRequestContainer'
import { CreateRequestView } from '@/components/views/requestLists/CreateRequestView'

const CreatePage = () => {
    return (
        <CreateRequestContainer
            View={(props) => (
                <CreateRequestView
                    canEdit={props.canEdit}
                    canEditDate={props.canEditDate}
                    entityName={props.entityName}
                    isError={props.isError}
                    errorMessages={props.errorMessages}
                    isLoading={props.isLoading}
                    firstNotUsedCode={props.firstNotUsedCode}
                    onCheckIfCodeListExist={props.onCheckIfCodeListExist}
                    loadOptions={props.loadOptions}
                    onSave={props.onSave}
                    onSend={props.onSend}
                    attributeProfile={props.attributeProfile}
                />
            )}
        />
    )
}

export default CreatePage
