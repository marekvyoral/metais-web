import { QueryFeedback, useGetVoteDetail } from '@isdd/metais-common/index'
import React from 'react'
import { useParams } from 'react-router-dom'

import { IVoteDetailView } from '../../views/votes/VoteDetailView'

interface IVoteDetailContainer {
    View: React.FC<IVoteDetailView>
}

export const VoteDetailContainer: React.FC<IVoteDetailContainer> = ({ View }) => {
    const { voteIdParam } = useParams()
    const voteId = () => {
        if (voteIdParam == undefined) {
            return 0
        }
        const voteIdValue = parseInt(voteIdParam)
        if (isNaN(voteIdValue)) {
            return 0
        }
        return voteIdValue
    }

    const { data: voteData } = useGetVoteDetail(voteId())

    return (
        <QueryFeedback loading={false} error={false} indicatorProps={{ layer: 'parent' }}>
            <View voteData={voteData} />
        </QueryFeedback>
    )
}
