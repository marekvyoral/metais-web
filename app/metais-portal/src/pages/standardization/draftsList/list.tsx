import React from 'react'
import { ActionsOverTable } from '@isdd/metais-common/src/components/actions-over-table/ActionsOverTable'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/src/constants'
import { GetFOPStandardRequestsParams } from '@isdd/metais-common/api/generated/standards-swagger'
import { CreateEntityButton } from '@isdd/metais-common'
import { useLocation, useNavigate } from 'react-router-dom'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import DraftsListContainer from '@/components/entities/draftsList/DraftsListContainer'
import DraftsListTable from '@/components/entities/draftsList/DraftsListTable'
import { DraftsListFilter } from '@/components/entities/draftsList/DraftsListFilter'
import { MainContentWrapper } from '@/components/MainContentWrapper'
const DraftsListListPage: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
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
            View={({ data, handleFilterChange, pagination, sort }) => (
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
                        <DraftsListFilter defaultFilterValues={defaultFilterValues} />
                        <ActionsOverTable
                            entityName="draftsList"
                            pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                            hiddenButtons={{ SELECT_COLUMNS: true, BULK_ACTIONS: true }}
                            handleFilterChange={handleFilterChange}
                            createButton={
                                <CreateEntityButton
                                    onClick={() => navigate(`${NavigationSubRoutes.ZOZNAM_NAVRHOV}/create`, { state: { from: location } })}
                                />
                            }
                        />
                        <DraftsListTable data={data} handleFilterChange={handleFilterChange} pagination={pagination} sort={sort} />
                    </MainContentWrapper>
                </>
            )}
        />
    )
}
export default DraftsListListPage
