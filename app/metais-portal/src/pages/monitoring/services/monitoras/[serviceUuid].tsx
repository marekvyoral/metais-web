import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { HowTo } from '@isdd/metais-common/constants'
import { getHowToTranslate } from '@isdd/metais-common/utils/utils'

import { ServiceDetailView } from '@/components/views/monitoring/services/ServiceDetailView'
import { MonitoringDetailFilterData, MonitoringServiceDetailContainer } from '@/components/containers/MonitoringServiceDetailContainer'

export interface IQueryParamsDetail {
    serviceUuid: string
    serviceType: string
    dateFrom: string
    dateTo: string
    owner: string
    project: string
    isvs: string
}

const DetailServicePage: React.FC = () => {
    const { t } = useTranslation()
    const [urlParams] = useSearchParams()

    const queryParams: IQueryParamsDetail = {
        serviceUuid: urlParams.get('serviceUuid') ?? '',
        serviceType: urlParams.get('serviceType') ?? '',
        dateTo: urlParams.get('dateTo') ?? '',
        dateFrom: urlParams.get('dateFrom') ?? '',
        owner: urlParams.get('owner') ?? '',
        project: urlParams.get('project') ?? '',
        isvs: urlParams.get('isvs') ?? '',
    }

    const defaultFilterValues: MonitoringDetailFilterData = {
        serviceType: urlParams.get('serviceType') ?? '',
        serviceUuid: urlParams.get('serviceUuid') ?? '',
        dateFrom: queryParams.dateFrom,
        dateTo: queryParams.dateTo,
        service: queryParams.serviceUuid,
        owner: queryParams.owner,
        project: queryParams.project,
        isvs: queryParams.isvs,
    }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: getHowToTranslate(HowTo.MONITORING_HOWTO, t), href: RouteNames.HOW_TO_MONITORING },
                    { label: t('titles.monitoringServices') ?? '', href: RouterRoutes.MONITORING_SERVICES },
                ]}
            />
            <MonitoringServiceDetailContainer
                defaultFilterValues={defaultFilterValues}
                queryParams={queryParams}
                View={(props) => <ServiceDetailView {...props} />}
            />
        </>
    )
}

export default DetailServicePage
