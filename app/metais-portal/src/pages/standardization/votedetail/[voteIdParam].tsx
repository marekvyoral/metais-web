import React from 'react'

import { VoteDetailContainer } from '@/components/containers/votes/VoteDetailContainer'
import { IVoteDetailView, VoteDetailView } from '@/components/views/votes/VoteDetailView'

const VoteDetail: React.FC<IVoteDetailView> = () => {
    return <VoteDetailContainer View={(props) => <VoteDetailView voteResultData={props.voteResultData} voteData={props.voteData} />} />
}

export default VoteDetail
