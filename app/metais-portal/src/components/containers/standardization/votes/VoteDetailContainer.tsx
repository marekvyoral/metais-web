import { QueryFeedback } from '@isdd/metais-common/index'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useCastVote, useGetVoteDetail, useGetVoteResult, useVetoVote } from '@isdd/metais-common/api/generated/standards-swagger'

import { IVoteDetailView } from '@/components/views/standardization/votes/voteDetail/VoteDetailView'

interface IVoteDetailContainer {
    View: React.FC<IVoteDetailView>
}

export const VoteDetailContainer: React.FC<IVoteDetailContainer> = ({ View }) => {
    const { voteIdParam } = useParams()
    const {
        state: { userInfo: user },
    } = useAuth()
    const isUserLogged = !!user
    const userId = user?.uuid ?? ''
    const userLogin = user?.login ?? ''
    const voteId = useMemo(() => {
        const voteIdValue = voteIdParam ? parseInt(voteIdParam) : 0
        return isNaN(voteIdValue) ? 0 : voteIdValue
    }, [voteIdParam])

    const { data: voteData, isLoading: voteDataLoading, isError: voteDataError } = useGetVoteDetail(voteId)
    const { data: voteResultData, isLoading: voteResultDataLoading, isError: voteResultDataError } = useGetVoteResult(voteId)
    const { isLoading: castVoteLoading, mutateAsync: castVoteAsyncMutation } = useCastVote()
    const { isLoading: vetoVoteLoading, mutateAsync: vetoVoteAsyncMutation } = useVetoVote()

    const castVote = async (voteIdentifier: number, choiceId: number, description: string) => {
        await castVoteAsyncMutation({
            voteId: voteIdentifier,
            castedUserId: userId,
            choiceId,
            data: { description },
        })
    }

    const vetoVote = async (voteIdentifier: number, description: string) => {
        await vetoVoteAsyncMutation({
            voteId: voteIdentifier,
            castedUserId: userId,
            data: { description },
        })
    }

    const canDoCast = useMemo((): boolean => {
        return voteData?.voteActors?.find((va) => va.userId == userLogin) !== undefined
    }, [userLogin, voteData?.voteActors])

    const castedVoteId = useMemo((): number | undefined => {
        return voteResultData?.actorResults?.find((ar) => ar.userId == userLogin && ar.votedChoiceId !== null)?.votedChoiceId
    }, [userLogin, voteResultData?.actorResults])

    const isLoading = voteDataLoading || voteResultDataLoading
    const isError = voteDataError || voteResultDataError

    return (
        <QueryFeedback loading={isLoading} error={isError} indicatorProps={{ layer: 'parent', transparentMask: true }}>
            <View
                voteResultData={voteResultData}
                voteData={voteData}
                canCastVote={canDoCast}
                castedVoteId={castedVoteId}
                castVote={castVote}
                vetoVote={vetoVote}
                votesProcessing={castVoteLoading || vetoVoteLoading}
                isUserLoggedIn={isUserLogged}
            />
        </QueryFeedback>
    )
}
