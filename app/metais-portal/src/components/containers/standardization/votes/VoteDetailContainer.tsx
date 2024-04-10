import { QueryFeedback } from '@isdd/metais-common/index'
import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import {
    useCancelVote,
    useCastVote,
    useCastVote1,
    useGetStandardRequestDetail,
    useGetVoteActorResult,
    useGetVoteDetail,
    useGetVoteResult,
    useVetoVote,
    useVetoVote1,
    useVoteNote,
} from '@isdd/metais-common/api/generated/standards-swagger'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { IVoteDetailView } from '@/components/views/standardization/votes/voteDetail/VoteDetailView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

interface IVoteDetailContainer {
    View: React.FC<IVoteDetailView>
}

export const VoteDetailContainer: React.FC<IVoteDetailContainer> = ({ View }) => {
    const { t } = useTranslation()
    const { voteId } = useParams()
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user
    const userId = user?.uuid ?? ''
    const userLogin = user?.login ?? ''

    const { data: voteData, isLoading: voteDataLoading, isError: voteDataError, refetch } = useGetVoteDetail(Number(voteId))

    const [votesProcessingError, setVotesProcessingError] = useState<string>()
    const [voted, setVoted] = useState<boolean>(false)

    const { isLoading: cancelVoteLoading, mutateAsync: cancelVoteAsyncMutation } = useCancelVote({
        mutation: { onSuccess: () => refetch(), onError: (resp) => setVotesProcessingError(resp.message) },
    })

    const {
        data: srData,
        isLoading: srLoading,
        isError: srError,
    } = useGetStandardRequestDetail(voteData?.standardRequestId ?? 0, { query: { enabled: !!voteData?.standardRequestId } })
    const standardRequestLoading = !!voteData?.standardRequestId && srLoading
    const {
        data: voteResultData,
        isLoading: voteResultDataLoading,
        isError: voteResultDataError,
        refetch: refetchResult,
    } = useGetVoteResult(Number(voteId))

    const canDoCast = useMemo((): boolean => {
        return voteData?.voteActors?.find((va) => va.userId == userLogin) !== undefined
    }, [userLogin, voteData?.voteActors])

    const {
        data: voteActorResultData,
        isLoading: voteActorResultLoading,
        isError: voteActorResultError,
        refetch: refetchActorResult,
    } = useGetVoteActorResult(Number(voteId), userId, { query: { enabled: canDoCast } })

    const { isLoading: voteNoteLoading, mutateAsync: voteNoteAsyncMutation } = useVoteNote({
        mutation: {
            onSuccess() {
                refetchResult()
                refetchActorResult()
                setVoted(true)
            },
            onError: (resp) => setVotesProcessingError(JSON.parse(resp.message ?? '')['message']),
        },
    })

    const { isLoading: castVoteLoading, mutateAsync: castVoteAsyncMutation } = useCastVote({
        mutation: {
            onSuccess() {
                refetchResult()
                refetchActorResult()
                setVoted(true)
            },
            onError: (resp) => setVotesProcessingError(JSON.parse(resp.message ?? '')['message']),
        },
    })

    const { isLoading: castUserVoteLoading, mutateAsync: castUserVoteAsyncMutation } = useCastVote1({
        mutation: {
            onSuccess() {
                refetchResult()
                refetchActorResult()
                setVoted(true)
            },
            onError: (resp) => setVotesProcessingError(JSON.parse(resp.message ?? '')['message']),
        },
    })
    const { isLoading: vetoVoteLoading, mutateAsync: vetoVoteAsyncMutation } = useVetoVote({
        mutation: {
            onSuccess() {
                setVoted(true)
            },
            onError: (resp) => setVotesProcessingError(JSON.parse(resp.message ?? '')['message']),
        },
    })
    const { isLoading: vetoUserVoteLoading, mutateAsync: vetoUserVoteAsyncMutation } = useVetoVote1({
        mutation: {
            onSuccess() {
                setVoted(true)
            },
            onError: (resp) => setVotesProcessingError(JSON.parse(resp.message ?? '')['message']),
        },
    })

    const castVote = async ({ choiceId, token, description }: { choiceId: number; token?: string; description?: string }) => {
        if (!voteData?.id) {
            return
        }
        if (token && choiceId) {
            await castVoteAsyncMutation({
                voteId: voteData?.id,
                token,
                choiceId,
            })
            return
        }
        await castUserVoteAsyncMutation({
            voteId: voteData?.id,
            castedUserId: userId,
            choiceId,
            data: { description },
        })
        return
    }
    const voteNote = async ({ token, description }: { token?: string; description: string }) => {
        if (!voteData?.id) {
            return
        }
        if (token) {
            await voteNoteAsyncMutation({
                voteId: voteData?.id,
                token,
                data: { note: description },
            })
            return
        }
    }

    const vetoVote = async ({ token, description }: { token?: string; description?: string }) => {
        if (!voteData?.id) {
            return
        }
        if (token) {
            await vetoVoteAsyncMutation({
                voteId: voteData?.id,
                token,
            })
        }
        await vetoUserVoteAsyncMutation({
            voteId: voteData?.id,
            castedUserId: userId,
            data: { description },
        })
    }

    const cancelVote = async (description: string) => {
        if (!voteData?.id) {
            return
        }

        await cancelVoteAsyncMutation({
            voteId: voteData?.id,
            data: { description },
        })
    }

    const castedVoteId = useMemo((): number | undefined => {
        return voteActorResultData?.votedChoiceId
    }, [voteActorResultData?.votedChoiceId])

    const isLoading = voteDataLoading || voteResultDataLoading || standardRequestLoading || cancelVoteLoading || (canDoCast && voteActorResultLoading)
    const isError = voteDataError || voteResultDataError || srError || voteActorResultError

    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('votes.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('votes.breadcrumbs.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },
                    { label: t('votes.breadcrumbs.VotesLists'), href: NavigationSubRoutes.ZOZNAM_HLASOV },
                    {
                        label: voteData?.name ?? t('votes.breadcrumbs.VoteDetail'),
                        href: `${NavigationSubRoutes.ZOZNAM_HLASOV_DETAIL}/${voteId}`,
                    },
                ]}
                withWidthContainer
            />
            <MainContentWrapper>
                <QueryFeedback loading={isLoading} error={isError} indicatorProps={{ layer: 'parent', transparentMask: false }}>
                    <View
                        voted={voted}
                        setVotesProcessingError={setVotesProcessingError}
                        votesProcessingError={votesProcessingError}
                        voteResultData={voteResultData}
                        voteData={voteData}
                        srData={srData}
                        canCastVote={canDoCast}
                        castedVoteId={castedVoteId}
                        castVote={castVote}
                        vetoVote={vetoVote}
                        voteNote={voteNote}
                        cancelVote={cancelVote}
                        votesProcessing={castVoteLoading || vetoVoteLoading || castUserVoteLoading || vetoUserVoteLoading || voteNoteLoading}
                        isUserLoggedIn={isUserLogged}
                    />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
