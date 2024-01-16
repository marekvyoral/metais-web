import React from 'react'
import { ActionsOverTable, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, CreateEntityButton, QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'

import { SlaContractListFilter } from './SlaContractListFilter'
import { SlaContractTable } from './SlaContractTable'

import { ISlaContractListView } from '@/components/containers/SlaContractListContainer'

export const SlaContractListView: React.FC<ISlaContractListView> = ({ data, isError, isLoading, defaultFilterValues, handleFilterChange, sort }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { contractPhaseData, slaContractsData } = data

    return (
        <>
            <FlexColumnReverseWrapper>
                <TextHeading size="L">{t('slaContracts.heading')}</TextHeading>
                <QueryFeedback loading={false} error={isError} />
            </FlexColumnReverseWrapper>
            <SlaContractListFilter defaultFilterValues={defaultFilterValues} contractPhaseData={contractPhaseData} />
            <ActionsOverTable
                pagination={{
                    pageNumber: slaContractsData?.pagination?.page ?? BASE_PAGE_NUMBER,
                    pageSize: slaContractsData?.pagination?.perPage ?? BASE_PAGE_SIZE,
                    dataLength: slaContractsData?.pagination?.totalItems ?? 0,
                }}
                handleFilterChange={handleFilterChange}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                entityName=""
                createButton={
                    <CreateEntityButton
                        label={t('slaContracts.createButton')}
                        onClick={() => navigate(RouterRoutes.INTEGRATION_CREATE, { state: { from: location } })}
                    />
                }
                hiddenButtons={{ SELECT_COLUMNS: true }}
            />
            <QueryFeedback loading={isLoading} error={false} withChildren>
                <SlaContractTable data={data} handleFilterChange={handleFilterChange} sort={sort} />
            </QueryFeedback>
        </>
    )
}
