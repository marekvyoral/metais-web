import { TextWarning } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { ConfigurationItemHistoryListContainer } from '@/components/containers/ConfigurationItemHistoryListContainer'
import { RefRegistersHistoryChangesTable } from '@/components/views/history/RefRegistersHistoryChangesTable'

const HistoryChanges = () => {
    const { t } = useTranslation()
    const { entityId } = useParams()

    return entityId ? (
        <ConfigurationItemHistoryListContainer
            configurationItemId={entityId}
            View={(props) => {
                return (
                    <RefRegistersHistoryChangesTable
                        data={props?.data?.historyVersions}
                        handleFilterChange={props.handleFilterChange}
                        isLoading={props.isLoading}
                        isError={props.isError}
                        pagination={props.pagination}
                    />
                )
            }}
        />
    ) : (
        <TextWarning>{t('errors.invalidEntityId')}</TextWarning>
    )
}

export default HistoryChanges
