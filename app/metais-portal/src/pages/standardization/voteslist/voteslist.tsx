import React from 'react'

import { VotesListContainer } from '@/components/containers/votes/VotesListContainer'
import { VotesListView } from '@/components/views/votes/VoteListView'

const VotesList: React.FC = () => {
    return (
        <VotesListContainer View={(props) => <VotesListView votesListData={props.votesListData} defaultFilterValues={props.defaultFilterValues} />} />
    )
}

export default VotesList
