import { useParams } from 'react-router-dom'

import { CodeListDetailContainer } from '@/components/containers/CodeListDetailContainer'
import { CodeListDetailWrapper } from '@/components/views/codeLists/CodeListDetailWrapper'
import { CodeListPermissionsWrapper } from '@/components/permissions/CodeListPermissionsWrapper'

const NotificationsDetailPage = () => {
    const { id } = useParams()

    return (
        <CodeListPermissionsWrapper id={id ?? ''}>
            <CodeListDetailContainer
                id={id}
                View={(props) => (
                    <CodeListDetailWrapper
                        data={props.data}
                        isLoading={props.isLoading}
                        isError={props.isError}
                        isErrorMutation={props.isErrorMutation}
                        isSuccessMutation={props.isSuccessMutation}
                        successMessage={props.successMessage}
                        workingLanguage={props.workingLanguage}
                        setWorkingLanguage={props.setWorkingLanguage}
                        invalidateCodeListDetailCache={props.invalidateCodeListDetailCache}
                        handleAllItemsReadyToPublish={props.handleAllItemsReadyToPublish}
                        handlePublishCodeList={props.handlePublishCodeList}
                        handleReturnToMainGestor={props.handleReturnToMainGestor}
                        handleSendToIsvs={props.handleSendToIsvs}
                        handleSendToSzzc={props.handleSendToSzzc}
                    />
                )}
            />
        </CodeListPermissionsWrapper>
    )
}

export default NotificationsDetailPage
