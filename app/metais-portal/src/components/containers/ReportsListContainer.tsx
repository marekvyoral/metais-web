import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { CategoryHeaderList, ReportHeader, useListCategories, useListReport } from '@isdd/metais-common/api/generated/report-swagger'
import { mapFilterToReportsParams } from '@isdd/metais-common/componentHelpers'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { FieldValues } from 'react-hook-form'

import { mapGenericTypeToPagination } from '@/componentHelpers/pagination'
import { ReportsFilterData } from '@/pages/reports/reports'

export interface IView {
    data?: ReportHeader[]
    categories?: CategoryHeaderList
    pagination: Pagination
    filter: IFilter
    handleFilterChange: (filter: IFilter) => void
    isLoading: boolean
    isFetching: boolean
    isError: boolean
}

interface IReportsListContainer {
    View: React.FC<IView>
    defaultFilterValues: ReportsFilterData
}

export const ReportsListContainer: React.FC<IReportsListContainer> = ({ View, defaultFilterValues }) => {
    const { filter: filterParams, handleFilterChange } = useFilterParams<FieldValues & IFilterParams & IFilter>(defaultFilterValues)

    const { isLoading, isFetching, isError, data } = useListReport(mapFilterToReportsParams(filterParams))
    const { isLoading: isLoadingCategories, isError: isErrorCategories, data: dataCategories } = useListCategories()

    const pagination = mapGenericTypeToPagination(filterParams, data)
    return (
        <View
            data={data?.reportHeaders ?? []}
            categories={dataCategories}
            filter={filterParams}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading || isLoadingCategories}
            isFetching={isFetching}
            isError={isError || isErrorCategories}
        />
    )
}
