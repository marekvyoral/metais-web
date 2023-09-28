import React from 'react'
import { useGetFOPStandardRequests } from '@isdd/metais-common/src/api/generated/standards-swagger' //../../../generated
import { useFilterForCiList, usePagination } from '@isdd/metais-common/src/api/hooks/containers/containerHelpers'
import { ATTRIBUTE_NAME, QueryFeedback } from '@isdd/metais-common'
import { mapFilterToStandardDrafts } from '@isdd/metais-common/src/api/filter/filterApi'
import { ColumnSort, IFilter, Pagination, SortType } from '@isdd/idsk-ui-kit/src/types'

interface IViewProps {
    data: any
    handleFilterChange: (filter: IFilter) => void
    pagination: Pagination
    sort: ColumnSort[]
}

interface IDraftsListDataTableContainerProps {
    View: React.FC<IViewProps>
    defaultFilterValues: any
}

const DraftsListDataTableContainer: React.FC<IDraftsListDataTableContainerProps> = ({ View, defaultFilterValues }) => {
    const { filterParams, handleFilterChange } = useFilterForCiList<any, any>(
        {
            ...defaultFilterValues,
            sort: [{ orderBy: ATTRIBUTE_NAME.Sr_Name, sortDirection: SortType.ASC }],
        },
        '',
    )
    const { data, isLoading, isError } = useGetFOPStandardRequests(mapFilterToStandardDrafts(filterParams))
    const pagination = usePagination({ pagination: { totaltems: data?.standardRequestsCount ?? 0 } }, filterParams)
    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View data={data} pagination={pagination} handleFilterChange={handleFilterChange} sort={filterParams?.sort ?? []} />
        </QueryFeedback>
    )
}
export default DraftsListDataTableContainer
