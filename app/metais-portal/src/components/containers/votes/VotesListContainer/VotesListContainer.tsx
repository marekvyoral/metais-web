import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, GetVotesParams, QueryFeedback, formatDateForDefaultValue, useGetVotes } from '@isdd/metais-common/index'
import React, { useMemo } from 'react'
import { SortType } from '@isdd/idsk-ui-kit/types'
import { DateTime } from 'luxon'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { IVotesParamsData, getVoteParamsData } from './votesListFunc'

import { IVotesListFilterData, IVotesListView } from '@/components/views/votes/VoteListView'
import { VoteStateEnum, VoteStateOptionEnum } from '@/components/views/votes/voteListProps'

interface IVotesListContainer {
    View: React.FC<IVotesListView>
}

const defaultFilterValues: IVotesListFilterData = {
    votesTypeToShow: ['everyone'],
    voteState: [''],
    effectiveFrom: '',
    effectiveTo: '',
}

export const VotesListContainer: React.FC<IVotesListContainer> = ({ View }) => {
    const { state: authState } = useAuth()
    const isUserLogged = authState.user !== null

    const { filter, handleFilterChange } = useFilterParams<IVotesListFilterData>({
        sort: [
            {
                orderBy: 'effectiveFrom',
                sortDirection: SortType.DESC,
            },
        ],
        ...defaultFilterValues,
    })

    const getVotesParamValues = useMemo((): GetVotesParams => {
        const voteParamsData = getVoteParamsData(filter.voteState?.[0], filter.effectiveFrom, filter.effectiveTo)
        const votesParamValues: GetVotesParams = {
            ascending: filter.sort?.[0]?.sortDirection === SortType.ASC ?? false,
            onlyMy: filter.votesTypeToShow?.[0] === 'onlyMy' ?? false,
            sortBy: filter.sort?.[0]?.orderBy ?? 'effectiveFrom',
            ...(voteParamsData.state !== undefined && voteParamsData.state !== '' && { state: voteParamsData.state }),
            ...(voteParamsData.dateFrom !== undefined && voteParamsData.dateFrom !== '' && { fromDate: voteParamsData.dateFrom }),
            ...(voteParamsData.dateTo !== undefined && voteParamsData.dateTo !== '' && { toDate: voteParamsData.dateTo }),
            pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
            perPage: filter.pageSize ?? BASE_PAGE_SIZE,
        }
        return votesParamValues
    }, [filter.effectiveFrom, filter.effectiveTo, filter.pageNumber, filter.pageSize, filter.sort, filter.voteState, filter.votesTypeToShow])

    const { data: votesList, isLoading, isError } = useGetVotes(getVotesParamValues)

    return (
        <QueryFeedback loading={isLoading} error={isError} indicatorProps={{ layer: 'parent' }}>
            <View
                isUserLogged={isUserLogged}
                votesListData={votesList}
                filter={filter}
                defaultFilterValues={defaultFilterValues}
                handleFilterChange={handleFilterChange}
            />
        </QueryFeedback>
    )
}
