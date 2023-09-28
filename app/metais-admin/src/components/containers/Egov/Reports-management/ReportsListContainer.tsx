import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { CategoryHeaderList, ReportHeader, ReportHeaderList, useListCategories, useListReport } from '@isdd/metais-common/api'
import { mapFilterToReportsParamsAdmin } from '@isdd/metais-common/componentHelpers'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { QueryFeedback } from '@isdd/metais-common/index'
import React from 'react'
import { FieldValues } from 'react-hook-form'

import { ReportsFilterData } from '@/pages/reports-management/reports-management'

export const mapReportHeaderListToPagination = (uiFilter?: IFilter, data?: ReportHeaderList | void): Pagination => {
    return {
        pageNumber: uiFilter?.pageNumber ?? BASE_PAGE_NUMBER,
        pageSize: uiFilter?.pageSize ?? BASE_PAGE_SIZE,
        dataLength: data?.totalCount ?? 0,
    }
}

export interface IView {
    data?: ReportHeader[]
    categories?: CategoryHeaderList
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
}

interface IReportsListContainer {
    View: React.FC<IView>
    defaultFilterValues: ReportsFilterData
}

export const ReportsListContainer: React.FC<IReportsListContainer> = ({ View, defaultFilterValues }) => {
    const { filter: filterParams, handleFilterChange } = useFilterParams<FieldValues & IFilterParams & IFilter>(defaultFilterValues)

    const { isLoading, isError, data } = useListReport(mapFilterToReportsParamsAdmin(filterParams))
    const { isLoading: isLoadingCategories, isError: isErrorCategories, data: dataCategories } = useListCategories()

    const pagination = mapReportHeaderListToPagination(filterParams, data)
    return (
        <QueryFeedback loading={isLoading || isLoadingCategories} error={isError || isErrorCategories} indicatorProps={{ layer: 'parent' }}>
            <View
                data={data?.reportHeaders ?? undefined}
                categories={dataCategories}
                pagination={pagination}
                handleFilterChange={handleFilterChange}
            />
        </QueryFeedback>
    )
}
