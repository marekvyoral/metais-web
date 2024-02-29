import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { RoleParticipantUI, useGetRoleParticipantBulk } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ApiCodelistPreview, useGetCodelistHeaders } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { Dispatch, SetStateAction, useState } from 'react'

export enum CodeListFilterOnlyBase {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

export enum CodeListState {
    PUBLISHED = 'PUBLISHED',
    UPDATING = 'UPDATING',
    READY_TO_PUBLISH = 'READY_TO_PUBLISH',
    ISVS_PROCESSING = 'ISVS_PROCESSING',
    KS_ISVS_REJECTED = 'KS_ISVS_REJECTED',
    KS_ISVS_ACCEPTED = 'KS_ISVS_ACCEPTED',
}

interface CodeListData {
    list?: ApiCodelistPreview[]
    roleParticipants?: RoleParticipantUI[]
    dataLength?: number
}

export interface CodeListListViewProps {
    data?: CodeListData
    filter: IFilter
    handleFilterChange: (filter: IFilter) => void
    isLoading: boolean
    isError: boolean
    isOnlyPublishedPage?: boolean
    rowSelection: Record<string, ApiCodelistPreview>
    setRowSelection: Dispatch<SetStateAction<Record<string, ApiCodelistPreview>>>
}

export interface CodeListListFilterData extends IFilterParams, IFilter {
    language?: string
    sortBy?: string
    ascending?: boolean
    mainGestorPoUuid?: string
    onlyBase?: CodeListFilterOnlyBase
    toDate?: string
    wfState?: string
    code?: string
    name?: string
}

interface CodeListContainerProps {
    isOnlyPublishedPage?: boolean
    View: React.FC<CodeListListViewProps>
}

export const defaultFilterValues = {
    onlyBase: undefined,
    mainGestorPoUuid: '',
    toDate: '',
    wfState: '',
    code: '',
    name: '',
}

export const CodeListListContainer: React.FC<CodeListContainerProps> = ({ isOnlyPublishedPage, View }) => {
    const { filter, handleFilterChange } = useFilterParams<CodeListListFilterData>({
        sort: [
            {
                orderBy: 'code',
                sortDirection: SortType.DESC,
            },
        ],
        ...defaultFilterValues,
    })

    const apiFilter = {
        language: 'sk',
        pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
        perPage: filter.pageSize ?? BASE_PAGE_SIZE,
        sortBy: filter.sort?.[0]?.orderBy ?? 'code',
        ascending: filter.sort?.[0]?.sortDirection === SortType.ASC,
        ...(filter?.attributeFilters?.code && { code: filter?.attributeFilters?.code?.[0]?.value ?? '' }),
        ...(filter?.attributeFilters?.onlyBase && { isBase: filter?.attributeFilters?.onlyBase?.[0]?.value === 'true' ?? '' }),
        ...(filter?.attributeFilters?.toDate && { toDate: filter?.attributeFilters?.toDate?.[0]?.value ?? '' }),
        ...(filter?.attributeFilters?.mainGestorPoUuid && { mainGestorPoUuid: filter?.attributeFilters?.mainGestorPoUuid?.[0]?.value ?? '' }),
        ...(filter?.attributeFilters?.wfState && { wfState: filter?.attributeFilters?.wfState?.[0]?.value ?? filter.wfState }),
        ...(filter.name && { nameFilter: filter.name }),
        ...(isOnlyPublishedPage && { wfState: CodeListState.PUBLISHED }),
    }

    const { isFetching: isLoadingCodelistHeaders, isError: isErrorCodelistHeaders, data: codelistHeadersData } = useGetCodelistHeaders(apiFilter)

    const gids = (codelistHeadersData?.codelists ?? [])
        .filter((item) => item?.mainCodelistManagers?.length)
        .map((item) => item.mainCodelistManagers?.[0]?.value || '')

    const {
        data: roleParticipantsData,
        isFetching: isLoadingRoleParticipants,
        isError: isErrorRoleParticipants,
        isFetching: isFetchingCiList,
    } = useGetRoleParticipantBulk({ gids }, { query: { enabled: !!gids.length } })

    const isLoading = [isLoadingCodelistHeaders, isLoadingRoleParticipants && isFetchingCiList].some((item) => item)
    const isError = [isErrorCodelistHeaders, isErrorRoleParticipants].some((item) => item)

    const data = {
        list: codelistHeadersData?.codelists,
        roleParticipants: roleParticipantsData,
        dataLength: codelistHeadersData?.codelistsCount,
    }
    const [rowSelection, setRowSelection] = useState<Record<string, ApiCodelistPreview>>({})

    return (
        <View
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            data={data}
            filter={filter}
            handleFilterChange={handleFilterChange}
            isError={isError}
            isLoading={isLoading}
            isOnlyPublishedPage={isOnlyPublishedPage}
        />
    )
}
