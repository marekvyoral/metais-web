import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { ReportsListContainer } from '@/components/containers/Egov/Reports-management/ReportsListContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { ReportsListView } from '@/components/views/egov/reports/ReportsListView'

export interface ReportsFilterData extends IFilterParams {
    name?: string
    category?: string
}

const ReportsListPage: React.FC = () => {
    const { t } = useTranslation()
    const defaultFilterValues: ReportsFilterData = { name: '', category: '' }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: AdminRouteNames.HOME, icon: HomeIcon },
                    { label: t('breadcrumbs.reports-management'), href: `${AdminRouteNames.REPORTS_MANAGEMENT}` },
                ]}
            />
            <MainContentWrapper>
                <ReportsListContainer
                    defaultFilterValues={defaultFilterValues}
                    View={(props) => (
                        <ReportsListView
                            data={props.data}
                            categories={props.categories}
                            pagination={props.pagination}
                            saveMutationIsSuccess={props.saveMutationIsSuccess}
                            changeMutationIsSuccess={props.changeMutationIsSuccess}
                            defaultFilterValues={props.defaultFilterValues}
                            handleFilterChange={props.handleFilterChange}
                            handleRowAction={props.handleRowAction}
                            changeMutationIsSuccessReset={props.changeMutationIsSuccessReset}
                        />
                    )}
                />
            </MainContentWrapper>
        </>
    )
}

export default ReportsListPage
