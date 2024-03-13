import React from 'react'
import { ActionsOverTable, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, CreateEntityButton, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { DEFAULT_PAGESIZE_OPTIONS, ENTITY_INTEGRATION } from '@isdd/metais-common/constants'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { ElementToScrollTo } from '@isdd/metais-common/components/element-to-scroll-to/ElementToScrollTo'

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
    const { isActionSuccess } = useActionSuccess()

    return (
        <>
            <FlexColumnReverseWrapper>
                <TextHeading size="L">{t('integrationLinks.heading')}</TextHeading>
                <QueryFeedback loading={false} error={isError} />
                <ElementToScrollTo trigger={isActionSuccess.value && isActionSuccess.additionalInfo?.type !== 'relationCreated'}>
                    <MutationFeedback
                        success={isActionSuccess.value}
                        successMessage={
                            isActionSuccess.additionalInfo?.type === 'create'
                                ? t('mutationFeedback.successfulCreated')
                                : t('mutationFeedback.successfulUpdated')
                        }
                    />
                </ElementToScrollTo>
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
                entityName={ENTITY_INTEGRATION}
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
