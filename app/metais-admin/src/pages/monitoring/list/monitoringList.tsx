import React from 'react'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { MonitoringListContainer } from '@/components/containers/Monitoring/list/MonitoringListContainer'
import { MonitoringListView } from '@/components/views/monitoring/list'

const MonitoringListPage = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('monitoring.breadcrumbs.home'), href: AdminRouteNames.HOME, icon: HomeIcon },
                    { label: t('monitoring.breadcrumbs.monitoring'), href: AdminRouteNames.MONITORING },
                    { label: t('monitoring.breadcrumbs.list'), href: AdminRouteNames.MONITORING_LIST },
                ]}
            />
            <MainContentWrapper>
                <MonitoringListContainer
                    View={(props) => (
                        <MonitoringListView
                            monitoringCfgApiData={props.monitoringCfgApiData}
                            ciListData={props.ciListData}
                            defaultFilterValues={props.defaultFilterValues}
                            filter={props.filter}
                            handleFilterChange={props.handleFilterChange}
                            isLoadingNextPage={props.isLoadingNextPage}
                            refetchListData={props.refetchListData}
                        />
                    )}
                />
            </MainContentWrapper>
        </>
    )
}

export default MonitoringListPage
