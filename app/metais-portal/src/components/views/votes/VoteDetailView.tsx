import React from 'react'

export interface IVoteDetailView {
    voteId: number
}

export const VoteDetailView: React.FC<IVoteDetailView> = ({ voteId }) => {
    return <>Hello aj em hir: VoteDetailView - id: {voteId}</>
}
