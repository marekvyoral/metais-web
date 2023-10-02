import React from 'react'

export interface IVoteEditView {
    voteId: number
}

export const VoteEditView: React.FC<IVoteEditView> = ({ voteId }) => {
    // const isNewVote = voteId == 0

    return <>Hello aj em hir: VoteEditView - id: {voteId}</>
}
