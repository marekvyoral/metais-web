import React from 'react'

import { VoteDetailContainer } from '@/components/containers/VoteDetailContainer'
import { IVoteDetailView, VoteDetailView } from '@/components/views/votes/VoteDetailView'

const VoteDetail: React.FC<IVoteDetailView> = () => {
    return <VoteDetailContainer View={(props) => <VoteDetailView voteId={props.voteId} />} />
}

export default VoteDetail
