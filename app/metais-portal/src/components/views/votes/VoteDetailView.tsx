import { ApiVote } from '@isdd/metais-common/api'
import React from 'react'

export interface IVoteDetailView {
    voteData: ApiVote | undefined
}

export const VoteDetailView: React.FC<IVoteDetailView> = ({ voteData }) => {
    console.log({ voteData })
    return <>Hello aj em hir: VoteDetailView - id: {voteData?.id}</>
}
