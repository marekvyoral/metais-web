import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { ApiCodelistPreview, useGetCodelistRequests } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { CodeListFilterOnlyBase } from '@isdd/metais-common/constants'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RoleParticipantUI } from '@isdd/metais-common/api/generated/cmdb-swagger'

import { RequestListPermissionsWrapper } from '@/components/permissions/RequestListPermissionsWrapper'

interface CodeListData {
    list?: ApiCodelistPreview[]
    roleParticipants?: RoleParticipantUI[]
    dataLength?: number
}

export interface RequestListViewProps {
    data?: CodeListData
    filter: IFilter
    handleFilterChange: (filter: IFilter) => void
    isLoading: boolean
    isError: boolean
}

export interface RequestListFilterData extends IFilterParams, IFilter {
    language?: string
    sortBy?: string
    ascending?: boolean
    onlyBase?: CodeListFilterOnlyBase
    toDate?: string
    wfState?: string[]
    code?: string
    name?: string
}

interface RequestListContainerProps {
    View: React.FC<RequestListViewProps>
}

export const defaultFilterValues = {
    onlyBase: undefined,
    mainGestorPoUuid: '',
    toDate: '',
    wfState: [],
    code: '',
    name: '',
}

export const RequestListContainer: React.FC<RequestListContainerProps> = ({ View }) => {
    const { i18n } = useTranslation()

    const { filter, handleFilterChange } = useFilterParams<RequestListFilterData>({
        sort: [
            {
                orderBy: 'id',
                sortDirection: SortType.ASC,
            },
        ],
        ...defaultFilterValues,
    })

    const {
        isFetching: isLoadingCodelistHeaders,
        isError: isErrorCodelistHeaders,
        data: requestListHeadersData,
    } = useGetCodelistRequests({
        language: i18n.language ?? 'sk',
        pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
        perPage: filter.pageSize ?? BASE_PAGE_SIZE,
        sortBy: filter.sort?.[0]?.orderBy ?? 'id',
        ascending: filter.sort?.[0]?.sortDirection === SortType.DESC ?? false,
        ...(filter.onlyBase && { isBase: filter.onlyBase === CodeListFilterOnlyBase.TRUE }),
        ...(filter.name && { nameFilter: filter.name }),
        ...(filter.code && { code: filter.code }),
        ...(filter.wfState?.length && { wfState: filter.wfState?.join(',') }),
    })

    const data = {
        list: requestListHeadersData?.codelists,
        dataLength: requestListHeadersData?.codelistsCount,
    }

    return (
        <RequestListPermissionsWrapper>
            <View
                data={data}
                filter={filter}
                handleFilterChange={handleFilterChange}
                isError={isErrorCodelistHeaders}
                isLoading={isLoadingCodelistHeaders}
            />
        </RequestListPermissionsWrapper>
    )
}
