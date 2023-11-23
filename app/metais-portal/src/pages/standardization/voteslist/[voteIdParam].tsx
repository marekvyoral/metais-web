import React from 'react'

import { VoteDetailContainer } from '@/components/containers/standardization/votes/VoteDetailContainer'
import { VoteDetailView } from '@/components/views/standardization/votes/voteDetail/VoteDetailView'

const VoteDetailPage: React.FC = () => {
    return (
        <VoteDetailContainer
            View={(props) => (
                <VoteDetailView
                    voteResultData={props.voteResultData}
                    voteData={props.voteData}
                    srData={props.srData}
                    canCastVote={props.canCastVote}
                    castedVoteId={props.castedVoteId}
                    castVote={props.castVote}
                    vetoVote={props.vetoVote}
                    cancelVote={props.cancelVote}
                    votesProcessing={props.votesProcessing}
                    isUserLoggedIn={props.isUserLoggedIn}
                />
            )}
        />
    )
}

export default VoteDetailPage
