import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { QueryFeedback } from '@isdd/metais-common'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, RoleParticipantUI, useGetRoleParticipantBulk } from '@isdd/metais-common/api'
import { ApiCodelistPreview, useGetCodelistHeaders } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface CodeListData {
    list?: ApiCodelistPreview[]
    roleParticipants?: RoleParticipantUI[]
    dataLength?: number
}

export interface CodeListListViewProps {
    data?: CodeListData
    filter: IFilter
    handleFilterChange: (filter: IFilter) => void
}

export interface CodeListListFilterData extends IFilterParams, IFilter {
    language?: string
    sortBy?: string
    ascending?: boolean
    mainGestorPoUuid?: string
    onlyBase?: boolean
    toDate?: string
}

interface CodeListContainerProps {
    View: React.FC<CodeListListViewProps>
}

export const defaultFilterValues = {
    mainGestorPoUuid: '',
    onlyBase: false,
    toDate: '',
}

export const CodeListListContainer: React.FC<CodeListContainerProps> = ({ View }) => {
    const { t, i18n } = useTranslation()

    const { filter, handleFilterChange } = useFilterParams<CodeListListFilterData>({
        sort: [
            {
                orderBy: 'code',
                sortDirection: SortType.DESC,
            },
        ],
        ...defaultFilterValues,
    })

    const {
        isLoading: isLoadingCodelistHeaders,
        isError: isErrorCodelistHeaders,
        data: codelistHeadersData,
    } = useGetCodelistHeaders({
        isBase: filter.onlyBase || false,
        toDate: filter.toDate || '',
        mainGestorPoUuid: filter.mainGestorPoUuid || '',
        language: i18n.language || 'sk',
        pageNumber: filter.pageNumber || BASE_PAGE_NUMBER,
        perPage: filter.pageSize || BASE_PAGE_SIZE,
        sortBy: filter.sort?.[0]?.orderBy ?? 'code',
        ascending: filter.sort?.[0]?.sortDirection === SortType.DESC ?? false,
        wfState: 'PUBLISHED',
    })

    const {
        data: roleParticipantsData,
        isLoading: isLoadingRoleParticipants,
        isError: isErrorRoleParticipants,
        isFetching: isFetchingCiList,
    } = useGetRoleParticipantBulk(
        { gids: codelistHeadersData?.codelists?.map((item) => item.mainCodelistManagers?.[0].value).filter((item): item is string => !!item) ?? [] },
        { query: { enabled: !!codelistHeadersData?.codelists?.length } },
    )

    const isLoading = [isLoadingCodelistHeaders, isLoadingRoleParticipants && isFetchingCiList].some((item) => item)
    const isError = [isErrorCodelistHeaders, isErrorRoleParticipants].some((item) => item)

    const data = {
        list: codelistHeadersData?.codelists,
        roleParticipants: roleParticipantsData,
        dataLength: codelistHeadersData?.codelistsCount,
    }

    return (
        <QueryFeedback
            loading={isLoading}
            error={isError}
            indicatorProps={{ fullscreen: true }}
            errorProps={{ errorMessage: t('feedback.failedFetch') }}
        >
            <View data={data} filter={filter} handleFilterChange={handleFilterChange} />
        </QueryFeedback>
    )
}
