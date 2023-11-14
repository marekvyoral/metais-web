import React from 'react'

export interface IVoteEditView {
    voteId: number
}

export const VoteEditView: React.FC<IVoteEditView> = ({ voteId }) => {
    return <>VoteEditView - id: {voteId}</>
}
