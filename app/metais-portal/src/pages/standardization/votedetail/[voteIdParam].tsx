import React from 'react'

import { VoteDetailContainer } from '@/components/containers/votes/VoteDetailContainer'
import { IVoteDetailView, VoteDetailView } from '@/components/views/standartization/votes/vodeDetail/VoteDetailView'

const VoteDetail: React.FC<IVoteDetailView> = () => {
    return (
        <VoteDetailContainer
            View={(props) => (
                <VoteDetailView
                    voteResultData={props.voteResultData}
                    voteData={props.voteData}
                    canCastVote={props.canCastVote}
                    castedVoteId={props.castedVoteId}
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
