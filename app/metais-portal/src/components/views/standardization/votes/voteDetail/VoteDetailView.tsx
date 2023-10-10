import { BreadCrumbs, Button, HomeIcon, Tab, Tabs, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ApiVote, ApiVoteResult } from '@isdd/metais-common/api'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useLocation, useNavigate } from 'react-router-dom'

import { Collapsible } from './voteDetailComponents/Collapsible/Collapsible'
import { voteActorResultsColumns } from './voteActorResultsColumns'
import { voteActorsColumns } from './voteActorsColumns'
import { PendingChangeData, voteActorPendingChangesColumns } from './voteActorPendingChangesColumns'
import { Spacer } from './voteDetailComponents/Spacer'
import { VoteOverViewItems } from './voteDetailComponents/VoteOverViewItems'

import { SimpleTable } from '@/components/views/standardization/votes/voteDetail/voteDetailComponents/SimpleTable'
import styles from '@/components/views/standardization/votes/voteDetail/voteDetail.module.scss'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { VotesHandler } from '@/components/views/standardization/votes/voteDetail/voteDetailComponents/VotesHandling'
import { VoteDetailItems } from '@/components/views/standardization/votes/voteDetail/voteDetailComponents/VoteDetailItems'

export interface IVoteDetailView {
    voteData: ApiVote | undefined
    voteResultData: ApiVoteResult | undefined
    canCastVote: boolean
    castedVoteId: number | undefined
    isUserLoggedIn: boolean
    votesProcessing: boolean
    castVote: (voteIdentifier: number, choiceId: number, description: string) => Promise<void>
    vetoVote: (voteIdentifier: number, description: string) => Promise<void>
}

export const VoteDetailView: React.FC<IVoteDetailView> = ({
    voteData,
    isUserLoggedIn,
    voteResultData,
    canCastVote,
    castedVoteId,
    castVote,
    vetoVote,
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
                content: <SimpleTable tableColumns={actorResultsColumns} tableData={actorResultsList} sort={undefined} />,
            }
        })
    }, [actorResultsColumns, selectedTab, voteResultData?.actorResults, voteResultData?.choiceResults])

    const handleCastVote = async (voteId: number | undefined, choiceId: number | undefined, description: string | undefined) => {
        await castVote(voteId ?? 0, choiceId ?? 0, description ?? '')
    }

    const handleVetoVote = async (voteId: number | undefined, description: string | undefined) => {
        await vetoVote(voteId ?? 0, description ?? '')
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
        navigate(`${NavigationSubRoutes.VOTE_EDIT}/${voteData?.id}`, { state: { from: location } })
    }

    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('votes.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('votes.breadcrumbs.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },
                    { label: t('votes.breadcrumbs.VotesLists'), href: NavigationSubRoutes.ZOZNAM_HLASOV },
                    { label: t('votes.breadcrumbs.VoteDetail'), href: NavigationSubRoutes.VOTE_DETAIL },
                ]}
            />
            <MainContentWrapper>
                <div className={styles.inlineSpaceBetween}>
                    <TextHeading size="XL">{voteData?.name ?? ''}</TextHeading>
                    {isUserLoggedIn && <Button type="submit" label={t('votes.voteDetail.editVote')} onClick={() => editVoteHandler()} />}
                </div>

                <VoteDetailItems voteData={voteData} />

                <Spacer />

                <TextHeading size="L">{t('votes.voteDetail.voteDescription')}</TextHeading>
                <TextBody>{voteData?.description ?? ''}</TextBody>

                <Spacer />

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

                <Spacer />

                <Collapsible
                    collapseSign={<div className={styles.collapsableSign}>-</div>}
                    expandSign={<div className={styles.collapsableSign}>+</div>}
                    heading={<div className={styles.textFormat}>{t('votes.voteDetail.voteActorsTitle')}</div>}
                >
                    {voteData?.voteActors && <SimpleTable tableColumns={actorColumns} tableData={voteData?.voteActors} sort={undefined} />}
                </Collapsible>
                <Spacer />

                <TextHeading size="L">{t('votes.voteDetail.voteOverview')}</TextHeading>
                <VoteOverViewItems voteData={voteData} voteResultData={voteResultData} />

                <Spacer />

                <Tabs
                    tabList={tabList}
                    onSelect={(selected) => {
                        setSelectedTab(selected.id)
                    }}
                />

                <Spacer />
                {pendingChangesData.length !== 0 && (
                    <Collapsible
                        collapseSign={<div className={styles.collapsableSign}>-</div>}
                        expandSign={<div className={styles.collapsableSign}>+</div>}
                        heading={<div className={styles.textFormat}>{t('votes.voteDetail.changeInfo')}</div>}
                    >
                        <SimpleTable tableColumns={actorPendingChangesColumns} tableData={pendingChangesData} sort={undefined} />
                    </Collapsible>
                )}
            </MainContentWrapper>
        </>
    )
}
