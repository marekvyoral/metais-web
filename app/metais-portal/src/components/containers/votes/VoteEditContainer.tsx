import { QueryFeedback } from '@isdd/metais-common/index'
import React from 'react'
import { useParams } from 'react-router-dom'

import { IVoteEditView } from '@/components/views/standartization/votes/VoteEditView'

interface IVoteEditContainer {
    View: React.FC<IVoteEditView>
}

export const VoteEditContainer: React.FC<IVoteEditContainer> = ({ View }) => {
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

    return (
        <QueryFeedback loading={false} error={false} indicatorProps={{ layer: 'parent' }}>
            <View voteId={voteId()} />
        </QueryFeedback>
    )
}
