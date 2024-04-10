import { AccordionContainer, Button, Tab, Tabs, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ApiStandardRequest, ApiVote, ApiVoteResult, getGetVoteDetailQueryKey } from '@isdd/metais-common/api/generated/standards-swagger'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions, Subject } from '@isdd/metais-common/hooks/permissions/useVotesListPermissions'
import { Spacer } from '@isdd/metais-common/components/spacer/Spacer'
import { TableWithPagination } from '@isdd/metais-common/components/TableWithPagination/TableWithPagination'
import { MutationFeedback } from '@isdd/metais-common/index'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { useQueryClient } from '@tanstack/react-query'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

import { PendingChangeData, voteActorPendingChangesColumns } from './voteActorPendingChangesColumns'
import { voteActorResultsColumns } from './voteActorResultsColumns'
import { voteActorsColumns } from './voteActorsColumns'

import { VoteStateOptionEnum, getVoteStateEnum } from '@/components/views/standardization/votes/voteProps'
import { CancelVoteButton } from '@/components/views/standardization/votes/components/CancelVoteButton'
import { VoteDetailItems } from '@/components/views/standardization/votes/components/VoteDetailItems'
import { VoteOverViewItems } from '@/components/views/standardization/votes/components/VoteOverViewItems'
import { VotesHandler } from '@/components/views/standardization/votes/components/VotesHandling'
import styles from '@/components/views/standardization/votes/voteDetail/voteDetail.module.scss'

export interface IVoteDetailView {
    voteData: ApiVote | undefined
    srData: ApiStandardRequest | undefined
    voteResultData: ApiVoteResult | undefined
    canCastVote: boolean
    castedVoteId: number | undefined
    isUserLoggedIn: boolean
    votesProcessing: boolean
    castVote: ({ choiceId, token, description }: { choiceId: number; token?: string; description?: string }) => Promise<void>
    vetoVote: ({ token, description }: { token?: string; description?: string }) => Promise<void>
    voteNote: ({ token, description }: { token?: string; description: string }) => Promise<void>
    cancelVote: (description: string) => Promise<void>
    votesProcessingError?: string
    setVotesProcessingError: React.Dispatch<React.SetStateAction<string | undefined>>
    voted: boolean
}

export const VoteDetailView: React.FC<IVoteDetailView> = ({
    voteData,
    isUserLoggedIn,
    voteResultData,
    srData,
    canCastVote,
    castedVoteId,
    castVote,
    vetoVote,
    cancelVote,
    voteNote,
    votesProcessing,
    votesProcessingError,
    setVotesProcessingError,
    voted,
}) => {
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const { isActionSuccess } = useActionSuccess()

    const getTabTitle = (textValue: string | undefined, numberValue: number | undefined): string => {
        return `${textValue ?? ''} (${numberValue ?? ''})`
    }
    const firstTabToSelect = voteResultData?.choiceResults?.[0]?.id?.toString() ?? ''
    const [selectedTab, setSelectedTab] = useState<string>(firstTabToSelect)
    const actorResultsColumns = voteActorResultsColumns(t)
    const actorColumns = voteActorsColumns(t)
    const actorPendingChangesColumns = voteActorPendingChangesColumns(t)
    const searchParams = new URLSearchParams(window.location.search)
    const token = searchParams.get('token')
    const choice = searchParams.get('choice')
    const [castVoteError, setCastVoteError] = useState(false)
    const [castVoteSuccess, setCastVoteSuccess] = useState(false)
    const [castVoteMessage, setCastVoteMessage] = useState('')
    const queryClient = useQueryClient()

    const tabList: Tab[] = useMemo((): Tab[] => {
        const choiceResultsList = voteResultData?.choiceResults ?? []
        const actorResultsList = voteResultData?.actorResults
            ? voteResultData?.actorResults?.filter((actorResult) => actorResult?.votedChoiceId?.toString() === selectedTab)
            : []
        return choiceResultsList.map((key) => {
            return {
                id: key?.id?.toString() ?? '',
                title: getTabTitle(key?.value, key?.votedActorsCount),
                content: (
                    <TableWithPagination
                        tableColumns={actorResultsColumns}
                        tableData={actorResultsList}
                        sort={undefined}
                        hiddenButtons={{ SELECT_COLUMNS: true }}
                    />
                ),
            }
        })
    }, [actorResultsColumns, selectedTab, voteResultData?.actorResults, voteResultData?.choiceResults])

    useEffect(() => {
        const castVoteProcess = async () => {
            try {
                if (!token) {
                    return
                }
                if (choice) {
                    await castVote({ choiceId: +choice, token })
                    setCastVoteSuccess(true)
                    setCastVoteMessage(t('votes.actions.castDesc'))
                } else {
                    await vetoVote({ token })
                    setCastVoteSuccess(true)
                    setCastVoteMessage(t('votes.actions.castDesc'))
                }
            } catch (error) {
                if (error instanceof Error && typeof error.message === 'string') {
                    const errorData = JSON.parse(error.message)
                    if (errorData.message === 'Token has been used for vote') {
                        setCastVoteError(true)
                        setCastVoteMessage(t('votes.actions.userToken'))
                    } else {
                        setCastVoteError(true)
                        setCastVoteMessage(t('votes.actions.failedToSend'))
                    }
                }
            }
        }
        castVoteProcess()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, choice])

    const handleCastVote = async (choiceId: number, description: string) => {
        await castVote({ choiceId, description })
    }

    const handleVetoVote = async (description: string | undefined) => {
        await vetoVote({ description })
    }

    const handleSendDescription = async (description: string) => {
        if (token) await voteNote({ token, description })
    }

    const changeDescription = (name: string, changeAction: string): string => {
        switch (changeAction) {
            case 'ADD':
                return `${name} ${t('votes.type.changeAction.added')}`
            default:
                return ''
        }
    }

    const pendingChangesData: PendingChangeData[] =
        voteData?.voteActorPendingChanges?.map((change, index) => {
            return {
                id: index,
                date: t('dateTime', { date: change.changeDate }),
                desctription: changeDescription(change.userName ?? '', change.changeAction ?? ''),
            }
        }) ?? []

    const editVoteHandler = () => {
        navigate(`${NavigationSubRoutes.ZOZNAM_HLASOV_EDIT}/${voteData?.id}/edit`, { state: { from: location } })
    }

    const voteState = useMemo(() => {
        return getVoteStateEnum(voteData?.voteState, voteData?.effectiveFrom ?? '', voteData?.effectiveTo ?? '')
    }, [voteData?.effectiveFrom, voteData?.effectiveTo, voteData?.voteState])

    const canCancelVote = useMemo(() => {
        return voteState == VoteStateOptionEnum.PLANNED
    }, [voteState])

    const canModifyVote = useMemo(() => {
        return (
            voteState == VoteStateOptionEnum.PLANNED ||
            (voteState !== VoteStateOptionEnum.SUMMARIZED &&
                voteState !== VoteStateOptionEnum.VETOED &&
                voteState !== VoteStateOptionEnum.UPCOMING &&
                voteState !== VoteStateOptionEnum.ENDED)
        )
    }, [voteState])

    const hideVoteModifyingButtons = useMemo(() => {
        return voteState == VoteStateOptionEnum.CANCELED || voteState == VoteStateOptionEnum.ENDED
    }, [voteState])

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (isActionSuccess.value) {
            scrollToMutationFeedback()
            if (isActionSuccess.additionalInfo?.type != 'create') {
                queryClient.invalidateQueries(getGetVoteDetailQueryKey(voteData?.id ?? 0))
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActionSuccess.value])

    const votesSum = useMemo(
        () =>
            voteResultData?.choiceResults
                ?.map((result) => result.votedActorsCount)
                .reduce((accumulator, currentValue) => (accumulator ?? 0) + (currentValue ?? 0), 0),
        [voteResultData?.choiceResults],
    )

    return (
        <>
            <div ref={wrapperRef}>
                <MutationFeedback
                    success={isActionSuccess.value}
                    successMessage={
                        isActionSuccess.additionalInfo?.type == 'create' ? t('votes.voteDetail.created') : t('mutationFeedback.successfulUpdated')
                    }
                />
            </div>
            <div className={styles.inlineSpaceBetween}>
                <TextHeading size="XL">{voteData?.name ?? ''}</TextHeading>

                {isUserLoggedIn && (
                    <div className={styles.inlineSpaceBetween}>
                        <Can I={Actions.EDIT} a={Subject.VOTE}>
                            {canModifyVote ? (
                                <Button
                                    type="submit"
                                    label={t('votes.voteDetail.editVote')}
                                    onClick={() => editVoteHandler()}
                                    disabled={!canModifyVote}
                                />
                            ) : (
                                <Tooltip
                                    on={'hover' || 'focus'}
                                    descriptionElement={t('votes.voteDetail.editVoteTooltip')}
                                    tooltipContent={() => (
                                        <Button
                                            type="submit"
                                            label={t('votes.voteDetail.editVote')}
                                            onClick={() => editVoteHandler()}
                                            disabled={!canModifyVote}
                                        />
                                    )}
                                    position={'bottom center'}
                                    arrow={false}
                                />
                            )}

                            <Spacer horizontal />
                            <CancelVoteButton disabled={!canCancelVote || !canModifyVote} cancelVote={cancelVote} />
                        </Can>
                    </div>
                )}
            </div>
            <VoteDetailItems voteData={voteData} srData={srData} />
            <Spacer vertical />
            <TextHeading size="L">{t('votes.voteDetail.voteDescription')}</TextHeading>
            <TextBody>{voteData?.description ?? ''}</TextBody>
            <Spacer vertical />
            <TextHeading size="L">{t('votes.voteDetail.votesHandlingTitle')}</TextHeading>
            <MutationFeedback
                success={castVoteSuccess}
                error={castVoteError}
                errorMessage={castVoteMessage || t('votes.actions.failedToSend')}
                successMessage={t('votes.actions.sent')}
                onMessageClose={() => {
                    setCastVoteError(false)
                    setCastVoteMessage('')
                }}
            />
            <VotesHandler
                voted={voted}
                setVotesProcessingError={setVotesProcessingError}
                votesProcessingError={votesProcessingError}
                voteData={voteData}
                handleCastVote={handleCastVote}
                handleVetoVote={handleVetoVote}
                canCast={((isUserLoggedIn && canCastVote) || !!token) ?? false}
                canVeto={((isUserLoggedIn && canCastVote && voteData?.veto) || !!token) ?? false}
                voteProcessing={votesProcessing}
                castedVoteId={castedVoteId || (choice ? +choice : null)}
                vetoed={voteState == VoteStateOptionEnum.VETOED}
                canSendNote={!!token && !castVoteError}
                handleSendDescription={handleSendDescription}
                cancelState={hideVoteModifyingButtons}
            />
            <Spacer vertical />
            <AccordionContainer
                sections={[
                    {
                        title: t('votes.voteDetail.voteActorsTitle'),
                        summary: null,
                        content: voteData?.voteActors && <TableWithPagination tableColumns={actorColumns} tableData={voteData?.voteActors} />,
                    },
                ]}
            />
            <Spacer vertical />
            <TextHeading size="L">{t('votes.voteDetail.voteOverview')}</TextHeading>
            <VoteOverViewItems voteData={voteData} voteResultData={voteResultData} />
            <Spacer vertical />
            <Tabs
                key={votesSum}
                tabList={tabList}
                onSelect={(selected) => {
                    setSelectedTab(selected.id)
                }}
            />
            <Spacer vertical />
            {pendingChangesData.length !== 0 && (
                <AccordionContainer
                    sections={[
                        {
                            title: t('votes.voteDetail.changeInfo'),
                            summary: null,
                            content: voteData?.voteActors && (
                                <TableWithPagination
                                    tableColumns={actorPendingChangesColumns}
                                    tableData={pendingChangesData}
                                    hiddenButtons={{ SELECT_COLUMNS: true }}
                                />
                            ),
                        },
                    ]}
                />
            )}
        </>
    )
}
