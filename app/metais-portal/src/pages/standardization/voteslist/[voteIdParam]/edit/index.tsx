import React from 'react'

import { VoteComposeFormView } from '@/components/views/standardization/votes/VoteComposeForm/VoteComposeFormView'
import { VoteCreateEditContainer } from '@/components/containers/standardization/votes/VoteCreateEditContainer'

const VoteEditPage: React.FC = () => {
    return (
        <VoteCreateEditContainer
            View={(props) => (
                <VoteComposeFormView
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

export default VoteEditPage
