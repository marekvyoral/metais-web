import { QueryFeedback, useGetVoteDetail, useGetVoteResult } from '@isdd/metais-common/index'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { IVoteDetailView } from '../../views/votes/VoteDetailView'

interface IVoteDetailContainer {
    View: React.FC<IVoteDetailView>
}

export const VoteDetailContainer: React.FC<IVoteDetailContainer> = ({ View }) => {
    const { voteIdParam } = useParams()
    const voteId = useMemo(() => {
        if (voteIdParam == undefined) {
            return 0
        }
        const voteIdValue = parseInt(voteIdParam)
        if (isNaN(voteIdValue)) {
            return 0
        }
        return voteIdValue
    }, [voteIdParam])

    const { data: voteData, isLoading: voteDataLoading } = useGetVoteDetail(voteId)
    const { data: voteResultData, isLoading: voteResultDataLoading } = useGetVoteResult(voteId)

    return (
        <QueryFeedback loading={voteDataLoading && voteResultDataLoading} error={false} indicatorProps={{ layer: 'parent' }}>
            <View voteResultData={voteResultData} voteData={voteData} />
        </QueryFeedback>
    )
}
