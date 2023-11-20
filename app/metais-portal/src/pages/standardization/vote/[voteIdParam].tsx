import React from 'react'

import { VoteEditView } from '@/components/views/standardization/votes/voteEdit/VoteEditView'
import { VoteEditContainer } from '@/components/containers/standardization/votes/VoteEditContainer'

const VoteEdit: React.FC = () => {
    return (
        <VoteEditContainer
            View={(props) => (
                <VoteEditView
                    user={props.user}
                    existingVoteDataToEdit={props.existingVoteDataToEdit}
                    allStandardRequestData={props.allStandardRequestData}
                    groupWithIdentitiesData={props.groupWithIdentitiesData}
                    isSubmitLoading={props.isSubmitLoading}
                    isSubmitError={props.isSubmitError}
                    isIdentifiersLoading={props.isIdentifiersLoading}
                    createVote={props.createVote}
                    updateVote={props.updateVote}
                    onCancel={props.onCancel}
                />
            )}
        />
    )
}

export default VoteEdit
