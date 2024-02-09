import React from 'react'
import { useTranslation } from 'react-i18next'

import { VoteComposeFormView } from '@/components/views/standardization/votes/VoteComposeForm/VoteComposeFormView'
import { VoteCreateEditContainer } from '@/components/containers/standardization/votes/VoteCreateEditContainer'
import { getPageTitle } from '@/components/views/standardization/votes/VoteComposeForm/functions/voteEditFunc'

const VoteCreatePage: React.FC = () => {
    const { t } = useTranslation()
    document.title = getPageTitle(true, t)
    return (
        <VoteCreateEditContainer
            isNewVote
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

export default VoteCreatePage
