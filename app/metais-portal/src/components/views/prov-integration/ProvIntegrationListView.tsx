import React from 'react'
import { ActionsOverTable, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, CreateEntityButton, QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'

import { ProvIntegrationListFilter } from './ProvIntegrationListFilter'
import { ProvIntegrationTable } from './ProvIntegrationTable'

import { IProvIntegrationListView } from '@/components/containers/ProvIntegrationListContainer'

export const ProvIntegrationListView: React.FC<IProvIntegrationListView> = ({
    data,
    isError,
    isLoading,
    defaultFilterValues,
    handleFilterChange,
    sort,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { listIntegrationLinks, dizStateData } = data

    return (
        <>
            <FlexColumnReverseWrapper>
                <TextHeading size="L">{t('integrationLinks.heading')}</TextHeading>
                <QueryFeedback loading={false} error={isError} />
            </FlexColumnReverseWrapper>
            <ProvIntegrationListFilter defaultFilterValues={defaultFilterValues} dizStateData={dizStateData} />
            <ActionsOverTable
                pagination={{
                    pageNumber: listIntegrationLinks?.pagination?.page ?? BASE_PAGE_NUMBER,
                    pageSize: listIntegrationLinks?.pagination?.perPage ?? BASE_PAGE_SIZE,
                    dataLength: listIntegrationLinks?.pagination?.totalItems ?? 0,
                }}
                handleFilterChange={handleFilterChange}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                entityName=""
                createButton={
                    <CreateEntityButton
                        label={t('integrationLinks.createButton')}
                        onClick={() => navigate(RouterRoutes.INTEGRATION_CREATE, { state: { from: location } })}
                    />
                }
                hiddenButtons={{ SELECT_COLUMNS: true }}
            />
            <QueryFeedback loading={isLoading} error={false} withChildren>
                <ProvIntegrationTable data={data} handleFilterChange={handleFilterChange} sort={sort} />
            </QueryFeedback>
        </>
    )
}
