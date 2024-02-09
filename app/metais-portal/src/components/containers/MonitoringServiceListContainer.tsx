import { IFilter } from '@isdd/idsk-ui-kit/types'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { FieldValues } from 'react-hook-form'
import { ApiMonitoringOverviewList, useListMonitoringOverview } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { BASE_PAGE_NUMBER } from '@isdd/metais-common/constants'
import { BASE_PAGE_SIZE } from '@isdd/metais-common/api'
export interface MonitoringFilterData extends IFilterParams, FieldValues, IFilterParams, IFilter {
    intervalStart?: string
    intervalEnd?: string
    serviceType?: string
    liableEntity?: string
    project?: string
    isvs?: string
    service?: string
}
export interface IView {
    data?: ApiMonitoringOverviewList
    filterParams: MonitoringFilterData
    defaultFilterValues: MonitoringFilterData
    handleFilterChange: (filter: IFilter) => void
    isLoading: boolean
    isError: boolean
}

interface IMonitoringServiceListContainer {
    View: React.FC<IView>
    defaultFilterValues: MonitoringFilterData
}

export const MonitoringServiceListContainer: React.FC<IMonitoringServiceListContainer> = ({ View, defaultFilterValues }) => {
    const { filter, handleFilterChange } = useFilterParams<MonitoringFilterData>(defaultFilterValues)

    const {
        data: dataAS,
        isLoading: isLoadingAs,
        isError: isErrorAs,
        isFetching: isFetchingAs,
    } = useListMonitoringOverview(
        {
            serviceTypes: [filter.serviceType ?? defaultFilterValues.serviceType ?? 'AS'],
            page: filter.pageNumber ?? BASE_PAGE_NUMBER,
            perPageSize: filter.pageSize ?? BASE_PAGE_SIZE,
            intervalStart: filter.intervalStart ?? '',
            intervalEnd: filter.intervalEnd ?? '',
            isvs: filter.isvs ?? '',
            liableEntity: filter.liableEntity ?? '',
        },
        {
            query: {
                enabled: true,
                queryKey: [filter],
            },
        },
    )

    const isLoading = [isLoadingAs, isFetchingAs].some((item) => item)
    const isError = [isErrorAs].some((item) => item)

    return (
        <View
            filterParams={filter}
            defaultFilterValues={defaultFilterValues}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading}
            isError={isError}
            data={dataAS}
        />
    )
}
