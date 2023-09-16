import { ApiVotePreviewList } from '@isdd/metais-common/api'
import React from 'react'

export interface IVotesListView {
    votesListData: ApiVotePreviewList | undefined
}

export const VotesListView: React.FC<IVotesListView> = ({ votesListData }) => {
    console.log({ votesListData })
    return <>Hello aj em hir: VoteListView</>
}
