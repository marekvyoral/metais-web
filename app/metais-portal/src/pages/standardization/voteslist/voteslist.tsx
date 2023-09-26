import React from 'react'
import { IFilter } from '@isdd/idsk-ui-kit/types'

import { VotesListContainer } from '@/components/containers/votes/VotesListContainer'
import { VotesListView } from '@/components/views/votes/VoteListView'

const VotesList: React.FC = () => {
    return (
        <VotesListContainer
            View={(props) => (
                <VotesListView
                    votesListData={props.votesListData}
                    defaultFilterValues={props.defaultFilterValues}
                    filter={props.filter}
                    handleFilterChange={props.handleFilterChange}
                />
            )}
        />
    )
}

export default VotesList
