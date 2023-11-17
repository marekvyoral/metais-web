import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { CodeListDetailContainer } from '@/components/containers/CodeListDetailContainer'
import { CodeListDetailWrapper } from '@/components/views/codeLists/CodeListDetailWrapper'
import { CodeListPermissionsWrapper } from '@/components/permissions/CodeListPermissionsWrapper'

const NotificationsDetailPage = () => {
    const { t } = useTranslation()
    const { id } = useParams()

    document.title = `${t('titles.codeListDetail')} | MetaIS`

    return (
        <CodeListPermissionsWrapper id={id ?? ''}>
            <CodeListDetailContainer
                id={id}
                View={(props) => (
                    <CodeListDetailWrapper
                        data={props.data}
                        isLoading={props.isLoading}
                        isLoadingMutation={props.isLoadingMutation}
                        isError={props.isError}
                        actionsErrorMessages={props.actionsErrorMessages}
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
