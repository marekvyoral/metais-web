import { QueryFeedback } from '@isdd/metais-common/index'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { IVoteEditView } from '@/components/views/standardization/votes/voteEdit/VoteEditView'

interface IVoteEditContainer {
    View: React.FC<IVoteEditView>
}

export const VoteEditContainer: React.FC<IVoteEditContainer> = ({ View }) => {
    const { voteIdParam } = useParams()
    const voteId = useMemo(() => {
        const voteIdValue = voteIdParam ? parseInt(voteIdParam) : 0
        return isNaN(voteIdValue) ? 0 : voteIdValue
    }, [voteIdParam])

    return (
        <QueryFeedback loading={false} error={false} indicatorProps={{ layer: 'parent' }}>
            <View voteId={voteId} />
        </QueryFeedback>
    )
}
