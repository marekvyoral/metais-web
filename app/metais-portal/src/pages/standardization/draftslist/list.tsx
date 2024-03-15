import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { CreateEntityButton, MutationFeedback, QueryFeedback } from '@isdd/metais-common'
import { DraftFilter } from '@isdd/metais-common/api/filter/filterApi'
import { GetFOPStandardRequestsParams } from '@isdd/metais-common/api/generated/standards-swagger'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { ActionsOverTable } from '@isdd/metais-common/src/components/actions-over-table/ActionsOverTable'
import { DEFAULT_PAGESIZE_OPTIONS, STANDARDIZATION_DRAFTS_LIST } from '@isdd/metais-common/src/constants'
import { formatTitleString } from '@isdd/metais-common/utils/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { DraftsListContainer } from '@/components/containers/draftslist/DraftsListContainer'
import { DraftsListFilter } from '@/components/entities/draftslist/DraftsListFilter'
import { DraftsListTable } from '@/components/entities/draftslist/DraftsListTable'

const DraftsListListPage: React.FC = () => {
    const navigate = useNavigate()
    const { isActionSuccess } = useActionSuccess()

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

    document.title = formatTitleString(t('breadcrumbs.draftsList'))

    return (
        <DraftsListContainer<DraftFilter>
            defaultFilterValues={defaultFilterValues}
            View={({ data, handleFilterChange, pagination, sort, isLoading, isError, workingGroupOptions }) => (
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
                                <MutationFeedback
                                    success={isActionSuccess.value}
                                    successMessage={
                                        isActionSuccess.additionalInfo?.type == 'create'
                                            ? t('mutationFeedback.successfulCreated')
                                            : t('mutationFeedback.successfulUpdated')
                                    }
                                />
                            </FlexColumnReverseWrapper>
                            <DraftsListFilter defaultFilterValues={defaultFilterValues} workingGroupOptions={workingGroupOptions ?? []} />
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
