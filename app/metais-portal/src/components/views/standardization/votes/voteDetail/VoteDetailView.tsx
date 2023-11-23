import { AccordionContainer, Button, Tab, Tabs, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ApiStandardRequest, ApiVote, ApiVoteResult } from '@isdd/metais-common/api/generated/standards-swagger'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { CancelVoteButton } from '../components/CancelVoteButton'
import { VoteStateOptionEnum, getVoteStateEnum } from '../voteProps'

import { PendingChangeData, voteActorPendingChangesColumns } from './voteActorPendingChangesColumns'
import { voteActorResultsColumns } from './voteActorResultsColumns'
import { voteActorsColumns } from './voteActorsColumns'

import { Spacer } from '@/components/Spacer/Spacer'
import { TableWithPagination } from '@/components/views/standardization/votes/components/TableWithPagination/TableWithPagination'
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
    castVote: (choiceId: number, description: string) => Promise<void>
    vetoVote: (description: string) => Promise<void>
    cancelVote: (description: string) => Promise<void>
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
    votesProcessing,
}) => {
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()

    const getTabTitle = (textValue: string | undefined, numberValue: number | undefined): string => {
        return `${textValue ?? ''} (${numberValue ?? ''})`
    }
    const firstTabToSelect = voteResultData?.choiceResults?.[0]?.id?.toString() ?? ''
    const [selectedTab, setSelectedTab] = useState<string>(firstTabToSelect)
    const actorResultsColumns = voteActorResultsColumns(t)
    const actorColumns = voteActorsColumns(t)
    const actorPendingChangesColumns = voteActorPendingChangesColumns(t)

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

    const handleCastVote = async (choiceId: number | undefined, description: string | undefined) => {
        await castVote(choiceId ?? 0, description ?? '')
    }

    const handleVetoVote = async (description: string | undefined) => {
        await vetoVote(description ?? '')
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
        return voteState == VoteStateOptionEnum.PLANNED || (voteState !== VoteStateOptionEnum.SUMMARIZED && voteState !== VoteStateOptionEnum.VETOED)
    }, [voteState])

    const hideVoteModifyingButtons = useMemo(() => {
        return voteState == VoteStateOptionEnum.CANCELED
    }, [voteState])

    return (
        <>
            <div className={styles.inlineSpaceBetween}>
                <TextHeading size="XL">{voteData?.name ?? ''}</TextHeading>
                {isUserLoggedIn && !hideVoteModifyingButtons && (
                    <div className={styles.inlineSpaceBetween}>
                        <Button type="submit" label={t('votes.voteDetail.editVote')} onClick={() => editVoteHandler()} disabled={!canModifyVote} />
                        <Spacer horizontal />
                        <CancelVoteButton disabled={!canCancelVote || !canModifyVote} cancelVote={cancelVote} />
                    </div>
                )}
            </div>

            <VoteDetailItems voteData={voteData} srData={srData} />

            <Spacer vertical />

            <TextHeading size="L">{t('votes.voteDetail.voteDescription')}</TextHeading>
            <TextBody>{voteData?.description ?? ''}</TextBody>
            <Spacer vertical />

            <TextHeading size="L">{t('votes.voteDetail.votesHandlingTitle')}</TextHeading>

            <VotesHandler
                voteData={voteData}
                handleCastVote={handleCastVote}
                handleVetoVote={handleVetoVote}
                canCast={(isUserLoggedIn && canCastVote) ?? false}
                canVeto={(isUserLoggedIn && canCastVote && voteData?.veto) ?? false}
                voteProcessing={votesProcessing}
                castedVoteId={castedVoteId}
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
