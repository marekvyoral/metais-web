import React, { useEffect } from 'react'
import { ActionsOverTable } from '@isdd/metais-common/src/components/actions-over-table/ActionsOverTable'
import { DEFAULT_PAGESIZE_OPTIONS, STANDARDIZATION_DRAFTS_LIST } from '@isdd/metais-common/src/constants'
import { GetFOPStandardRequestsParams } from '@isdd/metais-common/api/generated/standards-swagger'
import { CreateEntityButton, MutationFeedback, QueryFeedback } from '@isdd/metais-common'
import { useLocation, useNavigate } from 'react-router-dom'
import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'

import { DraftsListContainer } from '@/components/containers/draftslist/DraftsListContainer'
import { DraftsListTable } from '@/components/entities/draftslist/DraftsListTable'
import { DraftsListFilter } from '@/components/entities/draftslist/DraftsListFilter'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const DraftsListListPage: React.FC = () => {
    const navigate = useNavigate()
    const {
        isActionSuccess: { value: isSuccess, additionalInfo: additionalInfo },
    } = useActionSuccess()

    const location = useLocation()
    const { t } = useTranslation()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore // pageNumber a perPage je povinné my to ale pridávame automaticky preto ten komentár
    const defaultFilterValues: GetFOPStandardRequestsParams = {
        createdBy: '',
        state: '',
        fromDate: '',
        toDate: '',
        draftName: '',
        requestChannel: undefined,
        workGroupId: '',
    }

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (isSuccess) {
            scrollToMutationFeedback()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess])

    return (
        <DraftsListContainer<GetFOPStandardRequestsParams>
            defaultFilterValues={defaultFilterValues}
            isSuccessMutationFeedback={isSuccess}
            View={({ data, handleFilterChange, pagination, sort, isLoading, isError }) => (
                <>
                    <BreadCrumbs
                        withWidthContainer
                        links={[
                            { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                            { label: t('breadcrumbs.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },
                            { label: t('breadcrumbs.draftsList'), href: NavigationSubRoutes.ZOZNAM_NAVRHOV },
                        ]}
                    />
                    <MainContentWrapper>
                        <QueryFeedback loading={isLoading} error={isError}>
                            <FlexColumnReverseWrapper>
                                <TextHeading size="XL">{t('draftsList.heading')}</TextHeading>
                                <div ref={wrapperRef}>
                                    <MutationFeedback
                                        success={isSuccess}
                                        error={false}
                                        successMessage={
                                            additionalInfo?.type == 'create'
                                                ? t('mutationFeedback.successfulCreated')
                                                : t('mutationFeedback.successfulUpdated')
                                        }
                                    />
                                </div>
                            </FlexColumnReverseWrapper>
                            <DraftsListFilter defaultFilterValues={defaultFilterValues} />
                            <ActionsOverTable
                                pagination={pagination}
                                entityName={STANDARDIZATION_DRAFTS_LIST}
                                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                                hiddenButtons={{ SELECT_COLUMNS: true, BULK_ACTIONS: true }}
                                handleFilterChange={handleFilterChange}
                                createButton={
                                    <CreateEntityButton
                                        onClick={() => navigate(`${NavigationSubRoutes.ZOZNAM_NAVRHOV}/create`, { state: { from: location } })}
                                    />
                                }
                            />
                            <DraftsListTable
                                data={data}
                                handleFilterChange={handleFilterChange}
                                pagination={pagination}
                                sort={sort}
                                isLoading={isLoading}
                                isError={isError}
                            />
                        </QueryFeedback>
                    </MainContentWrapper>
                </>
            )}
        />
    )
}
export default DraftsListListPage
