import { EditRequestContainer } from '@/components/containers/EditRequestContainer'
import { CreateRequestView } from '@/components/views/requestLists/CreateRequestView'

const EditPage = () => {
    return (
        <EditRequestContainer
            View={(props) => (
                <CreateRequestView
                    canEdit={props.canEdit}
                    canEditDate={props.canEditDate}
                    entityName={props.entityName}
                    isError={props.isError}
                    isLoading={props.isLoading}
                    firstNotUsedCode={props.firstNotUsedCode}
                    onCheckIfCodeListExist={props.onCheckIfCodeListExist}
                    loadOptions={props.loadOptions}
                    onSave={props.onSave}
                    onSend={props.onSend}
                    editData={props.editData}
                    attributeProfile={props.attributeProfile}
                    onSaveDates={props.onSaveDates}
                />
            )}
        />
    )
}

export default EditPage
