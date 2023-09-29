import React from 'react'

import { VoteDetailContainer } from '@/components/containers/votes/VoteDetailContainer'
import { IVoteDetailView, VoteDetailView } from '@/components/views/votes/VoteDetailView'

const VoteDetail: React.FC<IVoteDetailView> = () => {
    return (
        <VoteDetailContainer
            View={(props) => (
                <VoteDetailView
                    voteResultData={props.voteResultData}
                    voteData={props.voteData}
                    castVote={props.castVote}
                    vetoVote={props.vetoVote}
                    votesProcessing={props.votesProcessing}
                    isUserLoggedIn={props.isUserLoggedIn}
                />
            )}
        />
    )
}

export default VoteDetail
