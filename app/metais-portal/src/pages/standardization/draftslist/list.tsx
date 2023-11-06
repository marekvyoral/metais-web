import React from 'react'
import { ActionsOverTable } from '@isdd/metais-common/src/components/actions-over-table/ActionsOverTable'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/src/constants'
import { GetFOPStandardRequestsParams } from '@isdd/metais-common/api/generated/standards-swagger'
import { CreateEntityButton, QueryFeedback } from '@isdd/metais-common'
import { useLocation, useNavigate } from 'react-router-dom'
import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { DraftsListContainer } from '@/components/containers/draftslist/DraftsListContainer'
import { DraftsListTable } from '@/components/entities/draftslist/DraftsListTable'
import { DraftsListFilter } from '@/components/entities/draftslist/DraftsListFilter'
import { MainContentWrapper } from '@/components/MainContentWrapper'
const DraftsListListPage: React.FC = () => {
    const navigate = useNavigate()
    const entityName = 'draftsList'
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

    return (
        <DraftsListContainer<GetFOPStandardRequestsParams>
            defaultFilterValues={defaultFilterValues}
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
                            <TextHeading size="XL">{t('draftsList.heading')}</TextHeading>
                            <DraftsListFilter defaultFilterValues={defaultFilterValues} />
                            <ActionsOverTable
                                entityName={entityName}
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
