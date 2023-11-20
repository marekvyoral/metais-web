import { QueryFeedback } from '@isdd/metais-common/index'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import {
    useCancelVote,
    useCastVote,
    useGetStandardRequestDetail,
    useGetVoteDetail,
    useGetVoteResult,
    useVetoVote,
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
    const { voteIdParam } = useParams()
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user
    const userId = user?.uuid ?? ''
    const userLogin = user?.login ?? ''
    const voteId = useMemo(() => {
        const voteIdValue = voteIdParam ? parseInt(voteIdParam) : 0
        return isNaN(voteIdValue) ? 0 : voteIdValue
    }, [voteIdParam])

    const { data: voteData, isLoading: voteDataLoading, isError: voteDataError } = useGetVoteDetail(voteId)
    const {
        data: srData,
        isLoading: srLoading,
        isError: srError,
    } = useGetStandardRequestDetail(voteData?.standardRequestId ?? 0, { query: { enabled: !!voteData?.standardRequestId } })
    const standardRequestLoading = !!voteData?.standardRequestId && srLoading
    const { data: voteResultData, isLoading: voteResultDataLoading, isError: voteResultDataError } = useGetVoteResult(voteId)
    const { isLoading: castVoteLoading, mutateAsync: castVoteAsyncMutation } = useCastVote()
    const { isLoading: vetoVoteLoading, mutateAsync: vetoVoteAsyncMutation } = useVetoVote()
    const { isLoading: cancelVoteLoading, mutateAsync: cancelVoteAsyncMutation } = useCancelVote()

    const castVote = async (choiceId: number, description: string) => {
        if (!voteData?.id) {
            return
        }

        await castVoteAsyncMutation({
            voteId: voteData?.id,
            castedUserId: userId,
            choiceId,
            data: { description },
        })
    }

    const vetoVote = async (description: string) => {
        if (!voteData?.id) {
            return
        }

        await vetoVoteAsyncMutation({
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

    const canDoCast = useMemo((): boolean => {
        return voteData?.voteActors?.find((va) => va.userId == userLogin) !== undefined
    }, [userLogin, voteData?.voteActors])

    const castedVoteId = useMemo((): number | undefined => {
        return voteResultData?.actorResults?.find((ar) => ar.userId == userLogin && ar.votedChoiceId !== null)?.votedChoiceId
    }, [userLogin, voteResultData?.actorResults])

    const isLoading = voteDataLoading || voteResultDataLoading || standardRequestLoading || cancelVoteLoading
    const isError = voteDataError || voteResultDataError || srError

    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('votes.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('votes.breadcrumbs.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },
                    { label: t('votes.breadcrumbs.VotesLists'), href: NavigationSubRoutes.ZOZNAM_HLASOV },
                    { label: voteData?.name ?? t('votes.breadcrumbs.VoteDetail'), href: `${NavigationSubRoutes.VOTE_DETAIL}/${voteIdParam}` },
                ]}
                withWidthContainer
            />
            <MainContentWrapper>
                <QueryFeedback loading={isLoading} error={isError} indicatorProps={{ layer: 'parent', transparentMask: false }}>
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
