import { EditCodeListContainerContainer } from '@/components/containers/EditCodeListContainer'
import { CodeListEditView } from '@/components/views/codeLists/CodeListEditView'

const EditCodeListPage = () => {
    return (
        <EditCodeListContainerContainer
            View={(props) => (
                <CodeListEditView
                    data={props.data}
                    entityName={props.entityName}
                    isError={props.isError}
                    errorMessages={props.errorMessages}
                    isLoading={props.isLoading}
                    loadOptions={props.loadOptions}
                    handleSave={props.handleSave}
                    handleDiscardChanges={props.handleDiscardChanges}
                    handleRemoveLock={props.handleRemoveLock}
                />
            )}
        />
    )
}

export default EditCodeListPage
