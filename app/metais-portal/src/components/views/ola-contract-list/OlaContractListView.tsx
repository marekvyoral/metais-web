import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { ActionsOverTable, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, CreateEntityButton, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { OlaContractListFilter } from './OlaContractListFilter'
import { OlaContractTable } from './OlaContractTable'

import { IOlaContractListView } from '@/components/containers/OlaContractListContainer'

export const OlaContractListView: React.FC<IOlaContractListView> = ({
    data,
    isError,
    isLoading,
    defaultFilterValues,
    handleFilterChange,
    sort,
    ownerGid,
    statesEnum,
    refetch,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    const { isActionSuccess } = useActionSuccess()
    const { wrapperRef, scrollToMutationFeedback } = useScroll()
    useEffect(() => {
        refetch()
        scrollToMutationFeedback()
    }, [isActionSuccess, refetch, scrollToMutationFeedback])

    return (
        <>
            <FlexColumnReverseWrapper>
                <TextHeading size="L">{t('olaContracts.title')}</TextHeading>
                <QueryFeedback loading={false} error={isError} />
            </FlexColumnReverseWrapper>
            <QueryFeedback loading={isLoading} error={false} withChildren>
                <div ref={wrapperRef} />
                <MutationFeedback
                    success={isActionSuccess.value && isActionSuccess?.additionalInfo?.type == 'create'}
                    successMessage={t('mutationFeedback.successfulCreated')}
                />
                <OlaContractListFilter defaultFilterValues={defaultFilterValues} />
                <ActionsOverTable
                    pagination={{
                        pageNumber: data?.pagination?.page ?? BASE_PAGE_NUMBER,
                        pageSize: data?.pagination?.perPage ?? BASE_PAGE_SIZE,
                        dataLength: data?.pagination?.totalItems ?? 0,
                    }}
                    handleFilterChange={handleFilterChange}
                    pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                    entityName=""
                    createButton={
                        !!ownerGid && (
                            <CreateEntityButton
                                label={t('olaContracts.createButton')}
                                onClick={() => navigate(RouterRoutes.OLA_CONTRACT_ADD, { state: { from: location } })}
                            />
                        )
                    }
                    hiddenButtons={{ SELECT_COLUMNS: true }}
                />

                <OlaContractTable data={data} handleFilterChange={handleFilterChange} sort={sort} statesEnum={statesEnum} />
            </QueryFeedback>
        </>
    )
}
