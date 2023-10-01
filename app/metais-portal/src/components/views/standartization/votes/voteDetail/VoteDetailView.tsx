import { BreadCrumbs, HomeIcon, Tab, Tabs, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ApiVote, ApiVoteResult } from '@isdd/metais-common/api'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'

import { Collapsable } from './voteDetailComponents/collapsable/collapsable'
import { voteActorResultsColumns } from './voteActorResultsColumns'
import { voteActorsColumns } from './voteActorsColumns'
import { PendingChangeData, voteActorPendingChangesColumns } from './voteActorPendingChangesColumns'

import { SimpleTable } from '@/components/views/standartization/votes/voteDetail/voteDetailComponents/SimpleTable'
import styles from '@/components/views/standartization/votes/voteDetail/voteDetail.module.scss'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { VotesHandling } from '@/components/views/standartization/votes/voteDetail/voteDetailComponents/VotesHandling'
import { VoteDetailItems } from '@/components/views/standartization/votes/voteDetail/voteDetailComponents/VoteDetailItems'

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

const Spacer: React.FC = () => {
    return <div className={styles.spaceVertical} />
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

    const getTabTitle = (textValue: string | undefined, numberValue: number | undefined): string => {
        return `${textValue ?? ''} (${numberValue ?? ''})`
    }
    const firstTabToSelect = voteResultData?.choiceResults?.[0]?.id?.toString() ?? ''
    const [selectedTab, setSelectedTab] = useState<string>(firstTabToSelect)

    const actorResultsColumns = useMemo(() => {
        return voteActorResultsColumns(t)
    }, [t])

    const actorColumns = useMemo(() => {
        return voteActorsColumns(t)
    }, [t])

    const actorPendingChangesColumns = useMemo(() => {
        return voteActorPendingChangesColumns(t)
    }, [t])

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
                return `${name} bol pridaný do hlasovania`
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
                <TextHeading size="XL">{voteData?.name ?? ''}</TextHeading>
                <VoteDetailItems voteData={voteData} />

                <Spacer />

                <TextHeading size="L">{t('votes.voteDetail.voteDescription')}</TextHeading>
                <TextBody>{voteData?.description ?? ''}</TextBody>

                <Spacer />

                <TextHeading size="L">{t('votes.voteDetail.votesHandlingTitle')}</TextHeading>

                <VotesHandling
                    voteData={voteData}
                    handleCastVote={handleCastVote}
                    handleVetoVote={handleVetoVote}
                    canCast={(isUserLoggedIn && canCastVote) ?? false}
                    canVeto={(isUserLoggedIn && canCastVote && voteData?.veto) ?? false}
                    voteProcessing={votesProcessing}
                />

                <Spacer />

                <Collapsable
                    collapseSign={<div className={styles.collapsableSign}>-</div>}
                    expandSign={<div className={styles.collapsableSign}>+</div>}
                    heading={<div className={styles.textFormat}>{t('votes.voteDetail.voteActorsTitle')}</div>}
                >
                    {voteData?.voteActors && <SimpleTable tableColumns={actorColumns} tableData={voteData?.voteActors} sort={undefined} />}
                </Collapsable>

                <Spacer />

                <Tabs
                    tabList={tabList}
                    onSelect={(selected) => {
                        setSelectedTab(selected.id)
                    }}
                />

                <Spacer />
                {pendingChangesData.length !== 0 && (
                    <Collapsable
                        collapseSign={<div className={styles.collapsableSign}>-</div>}
                        expandSign={<div className={styles.collapsableSign}>+</div>}
                        heading={<div className={styles.textFormat}>{t('votes.voteDetail.changeInfo')}</div>}
                    >
                        <SimpleTable tableColumns={actorPendingChangesColumns} tableData={pendingChangesData} sort={undefined} />
                    </Collapsable>
                )}
            </MainContentWrapper>
        </>
    )
}
