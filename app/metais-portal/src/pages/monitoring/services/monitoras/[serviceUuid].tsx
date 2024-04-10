import React from 'react'
import { useSearchParams } from 'react-router-dom'

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

    const queryFilterValues: MonitoringDetailFilterData = {
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
        <MonitoringServiceDetailContainer
            queryFilterValues={queryFilterValues}
            queryParams={queryParams}
            View={(props) => <ServiceDetailView {...props} />}
        />
    )
}

export default DetailServicePage
