import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, QueryFeedback } from '@isdd/metais-common/index'
import React, { useMemo } from 'react'
import { SortType } from '@isdd/idsk-ui-kit/types'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { GetVotesParams, useGetVotes } from '@isdd/metais-common/api/generated/standards-swagger'

import { getVoteParamsData } from './votesListFunc'

import { IVotesListFilterData, IVotesListView } from '@/components/views/standardization/votes/votesList/VoteListView'
import { VotesListShowEnum } from '@/components/views/standardization/votes/votesList/voteListProps'
import { VotesListColumnsEnum } from '@/components/views/standardization/votes/voteProps'

interface IVotesListContainer {
    View: React.FC<IVotesListView>
}

export const VotesListContainer: React.FC<IVotesListContainer> = ({ View }) => {
    const { userInfo: user } = useAuth()
    const isUserLogged = user !== null

    const defaultFilterValues: IVotesListFilterData = {
        votesTypeToShow: isUserLogged ? VotesListShowEnum.ONLY_MY : VotesListShowEnum.EVERYONE,
        voteState: '',
        effectiveFrom: '',
        effectiveTo: '',
    }

    const { filter, handleFilterChange } = useFilterParams<IVotesListFilterData>({
        sort: [
            {
                orderBy: VotesListColumnsEnum.EFFECTIVE_FROM,
                sortDirection: SortType.DESC,
            },
        ],
        ...defaultFilterValues,
    })

    const getVotesParamValues = useMemo((): GetVotesParams => {
        const voteParamsData = getVoteParamsData(filter.voteState, filter.effectiveFrom, filter.effectiveTo)
        const votesParamValues: GetVotesParams = {
            ascending: filter.sort?.[0]?.sortDirection === SortType.ASC,
            onlyMy: filter.votesTypeToShow === VotesListShowEnum.ONLY_MY,
            sortBy: filter.sort?.[0]?.orderBy ?? VotesListColumnsEnum.EFFECTIVE_FROM,
            ...(!!voteParamsData.state && { state: voteParamsData.state }),
            ...(!!voteParamsData.dateFrom && { fromDate: voteParamsData.dateFrom }),
            ...(!!voteParamsData.dateTo && { toDate: voteParamsData.dateTo }),
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
