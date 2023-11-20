import { TextWarning } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useReadCiNeighbours } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER } from '@isdd/metais-common/constants'
import { QueryFeedback } from '@isdd/metais-common/index'

import { ConfigurationItemHistoryListContainer } from '@/components/containers/ConfigurationItemHistoryListContainer'
import { RefRegistersHistoryChangesTable } from '@/components/views/history/RefRegistersHistoryChangesTable'

const RefRegistersHistoryChanges = () => {
    const { t } = useTranslation()
    const { entityId } = useParams()

    const {
        isLoading,
        isError,
        data: ciNeighboursData,
    } = useReadCiNeighbours(entityId ?? '', {
        page: BASE_PAGE_NUMBER,
        perpage: BASE_PAGE_NUMBER,
        sortBy: SortBy.NAME,
        sortType: SortType.ASC,
        neighboursFilter: {
            relType: ['ReferenceRegister_has_ReferenceRegisterHistory'],
            usageType: ['system'],
            metaAttributes: {
                state: ['DRAFT'],
            },
        },
    })

    const neighBourUUID = ciNeighboursData?.fromNodes?.neighbourPairs?.[0]?.configurationItem?.uuid ?? ''

    return entityId ? (
        <QueryFeedback loading={isLoading} error={isError} withChildren>
            <ConfigurationItemHistoryListContainer
                configurationItemId={neighBourUUID}
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
        </QueryFeedback>
    ) : (
        <TextWarning>{t('errors.invalidEntityId')}</TextWarning>
    )
}

export default RefRegistersHistoryChanges
