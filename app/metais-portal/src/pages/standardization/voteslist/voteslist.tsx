import React from 'react'

import { VotesListContainer } from '@/components/containers/standardization/votes/VotesListContainer/VotesListContainer'
import { VotesListView } from '@/components/views/standardization/votes/votesList/VoteListView'

const VotesList: React.FC = () => {
    return (
        <VotesListContainer
            View={(props) => (
                <VotesListView
                    votesListData={props.votesListData}
                    defaultFilterValues={props.defaultFilterValues}
                    filter={props.filter}
                    handleFilterChange={props.handleFilterChange}
                    isUserLogged={props.isUserLogged}
                />
            )}
        />
    )
}

export default VotesList
