import { useParams } from 'react-router-dom'

import { CodeListDetailContainer } from '@/components/containers/CodeListDetailContainer'
import { CodeListDetailWrapper } from '@/components/views/codeLists/CodeListDetailWrapper'

const NotificationsDetailPage = () => {
    const { id } = useParams()

    return (
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
                    handleAllItemsReadyToPublish={props.handleAllItemsReadyToPublish}
                    handlePublishCodeList={props.handlePublishCodeList}
                    handleReturnToMainGestor={props.handleReturnToMainGestor}
                    handleSendToIsvs={props.handleSendToIsvs}
                    handleSendToSzzc={props.handleSendToSzzc}
                />
            )}
        />
    )
}

export default NotificationsDetailPage
