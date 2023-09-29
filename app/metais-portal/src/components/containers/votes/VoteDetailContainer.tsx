import { QueryFeedback, useCastVote, useGetVoteDetail, useGetVoteResult, useVetoVote } from '@isdd/metais-common/index'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { IVoteDetailView } from '../../views/votes/VoteDetailView'

interface IVoteDetailContainer {
    View: React.FC<IVoteDetailView>
}

export const VoteDetailContainer: React.FC<IVoteDetailContainer> = ({ View }) => {
    const { voteIdParam } = useParams()
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user
    const userId = user?.uuid ?? ''
    const voteId = useMemo(() => {
        if (voteIdParam == undefined) {
            return 0
        }
        const voteIdValue = parseInt(voteIdParam)
        if (isNaN(voteIdValue)) {
            return 0
        }
        return voteIdValue
    }, [voteIdParam])

    const { data: voteData, isLoading: voteDataLoading } = useGetVoteDetail(voteId)
    const { data: voteResultData, isLoading: voteResultDataLoading } = useGetVoteResult(voteId)
    const { isLoading: castVoteLoading, mutateAsync: castVoteAsyncMutation } = useCastVote()
    const castVote = async (voteIdentifier: number, choiceId: number, description: string) => {
        await castVoteAsyncMutation({
            voteId: voteIdentifier,
            castedUserId: userId,
            choiceId,
            data: { description },
        })
    }
    const { isLoading: vetoVoteLoading, mutateAsync: vetoVoteAsyncMutation } = useVetoVote()
    const vetoVote = async (voteIdentifier: number, description: string) => {
        await vetoVoteAsyncMutation({
            voteId: voteIdentifier,
            castedUserId: userId,
            data: { description },
        })
    }
    return (
        <QueryFeedback loading={voteDataLoading || voteResultDataLoading} error={false} indicatorProps={{ layer: 'parent' }}>
            <View
                voteResultData={voteResultData}
                voteData={voteData}
                castVote={castVote}
                vetoVote={vetoVote}
                votesProcessing={castVoteLoading || vetoVoteLoading}
                isUserLoggedIn={isUserLogged}
            />
        </QueryFeedback>
    )
}
