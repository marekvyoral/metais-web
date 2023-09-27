import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, GetVotesParams, QueryFeedback, formatDateForDefaultValue, useGetVotes } from '@isdd/metais-common/index'
import React, { useMemo } from 'react'
import { SortType } from '@isdd/idsk-ui-kit/types'
import { DateTime } from 'luxon'
import { usePagination } from '@isdd/metais-common/api/hooks/containers/containerHelpers'

import { IVotesListFilterData, IVotesListView } from '@/components/views/votes/VoteListView'
import { VoteStateEnum, VoteStateOptionEnum } from '@/components/views/votes/voteListProps'

interface IVotesListContainer {
    View: React.FC<IVotesListView>
}

interface IVotesParamsData {
    state: string | undefined
    dateFrom: string | undefined
    dateTo: string | undefined
}

const defaultFilterValues: IVotesListFilterData = {
    votesTypeToShow: ['everyone'],
    voteState: [''],
    effectiveFrom: '',
    effectiveTo: '',
}

const getVoteParamsData = (voteStateOption: string, effectiveFrom: string, effectiveTo: string): IVotesParamsData => {
    const dateNow = DateTime.now().toString()
    const formattedDateNow = formatDateForDefaultValue(dateNow)
    switch (voteStateOption) {
        case VoteStateOptionEnum.planned:
            return {
                state: effectiveFrom === '' || effectiveFrom === undefined ? VoteStateEnum.CREATED : undefined,
                dateFrom: effectiveFrom === '' || effectiveFrom === undefined ? formattedDateNow : effectiveFrom,
                dateTo: effectiveTo,
            }
        case VoteStateOptionEnum.ended:
            return {
                state: effectiveTo === '' || effectiveTo === undefined ? VoteStateEnum.CREATED : undefined,
                dateFrom: effectiveFrom,
                dateTo: effectiveTo === '' || effectiveTo === undefined ? formattedDateNow : effectiveTo,
            }
        case VoteStateOptionEnum.upcomming:
            return {
                state: VoteStateEnum.CREATED,
                dateFrom: effectiveFrom === '' || effectiveFrom === undefined ? formattedDateNow : effectiveFrom,
                dateTo: effectiveTo === '' || effectiveTo === undefined ? formattedDateNow : effectiveTo,
            }
        case VoteStateOptionEnum.canceled:
            return { state: VoteStateEnum.CANCELED, dateFrom: effectiveFrom, dateTo: effectiveTo }
        case VoteStateOptionEnum.summarized:
            return { state: VoteStateEnum.SUMMARIZED, dateFrom: effectiveFrom, dateTo: effectiveTo }
        case VoteStateOptionEnum.vetoed:
            return { state: VoteStateEnum.VETOED, dateFrom: effectiveFrom, dateTo: effectiveTo }
        default:
            return { state: '', dateFrom: '', dateTo: '' }
    }
}

export const VotesListContainer: React.FC<IVotesListContainer> = ({ View }) => {
    const { filter, handleFilterChange } = useFilterParams<IVotesListFilterData>({
        sort: [
            {
                orderBy: 'effectiveFrom',
                sortDirection: SortType.DESC,
            },
        ],
        ...defaultFilterValues,
    })

    const voteParamsData = useMemo((): IVotesParamsData => {
        return getVoteParamsData(filter.voteState?.[0], filter.effectiveFrom, filter.effectiveTo)
    }, [filter.effectiveFrom, filter.effectiveTo, filter.voteState])

    const getVotesParamValues: GetVotesParams = {
        ascending: filter.sort?.[0]?.sortDirection === SortType.ASC ?? false,
        onlyMy: filter.votesTypeToShow?.[0] === 'onlyMy' ?? false,
        sortBy: filter.sort?.[0]?.orderBy ?? 'effectiveFrom',
        ...(voteParamsData.state !== undefined && voteParamsData.state !== '' && { state: voteParamsData.state }),
        ...(voteParamsData.dateFrom !== undefined && voteParamsData.dateFrom !== '' && { fromDate: voteParamsData.dateFrom }),
        ...(voteParamsData.dateTo !== undefined && voteParamsData.dateTo !== '' && { toDate: voteParamsData.dateTo }),
        pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
        perPage: filter.pageSize ?? BASE_PAGE_SIZE,
    }

    console.log({ voteParamsData })
    console.log({ getVotesParamValues })

    const { data: votesList, isLoading, isError } = useGetVotes(getVotesParamValues)

    return (
        <QueryFeedback loading={isLoading} error={isError} indicatorProps={{ layer: 'parent' }}>
            <View votesListData={votesList} filter={filter} defaultFilterValues={defaultFilterValues} handleFilterChange={handleFilterChange} />
        </QueryFeedback>
    )
}
