import { QueryFeedback, useReadVotesFromStandard } from '@isdd/metais-common/index'
import React from 'react'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { usePagination } from '@isdd/metais-common/api/hooks/containers/containerHelpers'

interface IVotesListContainer {
    View: React.FC
    defaultFilterValues: IVotesFilter
}

export interface IVotesFilter {
    state: string
    ascending: boolean
    onlyMy: boolean
    fromDate: string
    toDate: string
}

export const VotesListContainer: React.FC<IVotesListContainer> = ({ View, defaultFilterValues }) => {
    // const { filter: filterParams } = useFilterParams<IVotesFilter>(defaultFilterValues)
    // const { filter, handleFilterChange } = useFilterParams<IFilterData>({
    //     orderBy: defaultSort.orderBy,
    //     ascending: defaultSort.sortDirection === SortType.ASC ? 'true' : 'false',
    //     pageNumber: BASE_PAGE_NUMBER,
    //     pageSize: BASE_PAGE_SIZE,
    // })
    useReadVotesFromStandard(defaultFilterValues)
    // const pagination = usePagination(tableData, filterParams)
    return (
        <QueryFeedback loading={false} error={false} indicatorProps={{ layer: 'parent' }}>
            <View />
        </QueryFeedback>
    )
}
