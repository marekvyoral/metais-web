import { QueryFeedback, useCastVote, useGetVoteDetail, useGetVoteResult, useVetoVote } from '@isdd/metais-common/index'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { IVoteDetailView } from '@/components/views/standartization/votes/vodeDetail/VoteDetailView'

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
    const userlogin = user?.login ?? ''
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

    const { data: voteData, isLoading: voteDataLoading, error: voteDataError } = useGetVoteDetail(voteId)
    const { data: voteResultData, isLoading: voteResultDataLoading, error: voteResultDataError } = useGetVoteResult(voteId)
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

    const canDoCast = useMemo((): boolean => {
        return voteData?.voteActors?.find((va) => va.userId == userlogin) !== undefined
    }, [userlogin, voteData?.voteActors])

    const castedVoteId = useMemo((): number | undefined => {
        return voteResultData?.actorResults?.find((ar) => ar.userId == userlogin && ar.votedChoiceId !== null)?.votedChoiceId
    }, [userlogin, voteResultData?.actorResults])

    return (
        <QueryFeedback
            loading={voteDataLoading || voteResultDataLoading}
            error={!!voteDataError || !!voteResultDataError}
            indicatorProps={{ layer: 'parent', transparentMask: true }}
        >
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
