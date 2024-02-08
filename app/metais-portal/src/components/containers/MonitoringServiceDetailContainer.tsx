import { IFilter } from '@isdd/idsk-ui-kit/types'
import { EnumType, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ApiParameterTypesList, useListParameterTypes1 } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { FieldValues } from 'react-hook-form'

import { IQueryParamsDetail } from '@/pages/monitoring/services/monitoras/[serviceUuid]'

export interface MonitoringDetailFilterData extends IFilterParams, FieldValues, IFilterParams, IFilter {
    dateFrom?: string
    dateTo?: string
    serviceType?: string
    owner?: string
    project?: string
    isvs?: string
    service?: string
    serviceUuid?: string
}

export interface IView {
    data?: ApiParameterTypesList
    filterParams: MonitoringDetailFilterData
    defaultFilterValues: MonitoringDetailFilterData
    handleFilterChange: (filter: IFilter) => void
    isLoading: boolean
    isError: boolean
    queryParams?: IQueryParamsDetail
    tableDataParam?: EnumType
}

export enum ServiceDetailType {
    AS = 'AS',
    KS = 'KS',
}
interface IMonitoringServiceDetailContainer {
    View: React.FC<IView>
    defaultFilterValues: MonitoringDetailFilterData
    queryParams?: IQueryParamsDetail
}

export const MonitoringServiceDetailContainer: React.FC<IMonitoringServiceDetailContainer> = ({ View, defaultFilterValues, queryParams }) => {
    const { filter, handleFilterChange } = useFilterParams<MonitoringDetailFilterData>({
        ...defaultFilterValues,
        serviceUuid: queryParams?.serviceUuid ?? '',
    })

    const {
        data: chartData,
        isLoading: isLoadingPar,
        isError: isErrorPar,
    } = useListParameterTypes1({
        category: defaultFilterValues.serviceType === ServiceDetailType.AS ? 'c_typ_parametra_kategoria.1' : 'c_typ_parametra_kategoria.2',
    })

    const { data: tableDataParam, isLoading: isLoadingParam, isError: isErrorParam } = useGetValidEnum('TYP_PARAMETROV_JEDNOTKA')

    const isLoading = [isLoadingPar, isLoadingParam].some((item) => item)
    const isError = [isErrorPar, isErrorParam].some((item) => item)

    return (
        <View
            filterParams={filter}
            defaultFilterValues={defaultFilterValues}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading}
            isError={isError}
            data={chartData}
            queryParams={queryParams}
            tableDataParam={tableDataParam}
        />
    )
}
