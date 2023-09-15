import React from 'react'

import { IVotesFilter, VotesListContainer } from '@/components/containers/VotesListContainer'
import { VotesListView } from '@/components/views/votes/VoteListView'

const VotesList: React.FC = () => {
    const defaultFilterValues: IVotesFilter = {
        state: '',
        ascending: false,
        onlyMy: false,
        fromDate: '',
        toDate: '',
    }
    return <VotesListContainer defaultFilterValues={defaultFilterValues} View={() => <VotesListView />} />
}

export default VotesList
