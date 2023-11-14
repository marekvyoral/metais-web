import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import {
    ApiCodelistHistoriesList,
    useGetCodelistActionsHistory,
    useGetCodelistHistory,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { useState } from 'react'

export interface CodeListDetailHistoryViewProps {
    data?: {
        history?: ApiCodelistHistoriesList
        filter: {
            actions?: string[]
            modifiedBy?: string[]
        }
    }
    isError: boolean
    isLoading: boolean
    filter: IFilter
    handleFilterChange: (filter: IFilter) => void
}

export interface CodeListDetailHistoryContainerProps {
    code: string
    View: React.FC<CodeListDetailHistoryViewProps>
}

export const defaultFilterValues = {
    action: [],
    lastModifiedBy: [],
    fromDate: '',
    toDate: '',
}

export interface CodeListDetailHistoryFilterData extends IFilterParams, IFilter {
    action?: string[]
    lastModifiedBy?: string[]
    fromDate?: string
    toDate?: string
}

export const CodeListDetailHistoryContainer: React.FC<CodeListDetailHistoryContainerProps> = ({ code, View }) => {
    const [filter, setFilterState] = useState<CodeListDetailHistoryFilterData>({
        sort: [
            {
                orderBy: 'changedAt',
                sortDirection: SortType.DESC,
            },
        ],
        ...defaultFilterValues,
    })

    const handleFilterChange = (newFilter: CodeListDetailHistoryFilterData) => {
        setFilterState({
            ...filter,
            ...newFilter,
        })
    }

    const {
        isInitialLoading: isLoadingHistory,
        isError: isErrorHistory,
        data: historyData,
    } = useGetCodelistHistory(code, {
        pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
        perPage: filter.pageSize ?? BASE_PAGE_SIZE,
        sortBy: filter.sort?.[0]?.orderBy ?? 'changedAt',
        ascending: filter.sort?.[0]?.sortDirection === SortType.DESC ?? false,
        ...(filter.action && { action: filter.action }),
        ...(filter.lastModifiedBy && { lastModifiedBy: filter.lastModifiedBy }),
        ...(filter.fromDate && { fromDate: filter.fromDate }),
        ...(filter.toDate && { toDate: filter.toDate }),
    })

    const {
        isLoading: isLoadingFilterActions,
        isError: isErrorFilterActions,
        data: filterActionsData,
    } = useGetCodelistActionsHistory(code, 'actions')

    const {
        isLoading: isLoadingFilterModifiedBy,
        isError: isErrorFilterModifiedBy,
        data: filterModifiedByData,
    } = useGetCodelistActionsHistory(code, 'modifiedBy')

    const isLoading = [isLoadingFilterActions, isLoadingFilterModifiedBy, isLoadingHistory].some((item) => item)
    const isError = [isErrorFilterActions, isErrorFilterModifiedBy, isErrorHistory].some((item) => item)
    const data = {
        history: historyData,
        filter: {
            actions: filterActionsData,
            modifiedBy: filterModifiedByData,
        },
    }

    return <View data={data} isError={isError} isLoading={isLoading} filter={filter} handleFilterChange={handleFilterChange} />
}
