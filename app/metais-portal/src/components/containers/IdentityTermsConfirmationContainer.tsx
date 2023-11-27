import { QueryFeedback } from '@isdd/metais-common/index'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { IVoteDetailView } from '@/components/views/standardization/votes/voteDetail/VoteDetailView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

interface IIdentityTermsConfirmationContainer {
    View: React.FC<IVoteDetailView>
}

export const IdentityTermsConfirmationContainer: React.FC<IIdentityTermsConfirmationContainer> = ({ View }) => {
    return (
        <>
            <MainContentWrapper>
                <QueryFeedback loading={false} error={false} indicatorProps={{ layer: 'parent', transparentMask: false }}>
                    <View
                        voteResultData={voteResultData}
                        voteData={voteData}
                        srData={srData}
                        canCastVote={canDoCast}
                        castedVoteId={castedVoteId}
                        castVote={castVote}
                        vetoVote={vetoVote}
                        cancelVote={cancelVote}
                        votesProcessing={castVoteLoading || vetoVoteLoading}
                        isUserLoggedIn={isUserLogged}
                    />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
