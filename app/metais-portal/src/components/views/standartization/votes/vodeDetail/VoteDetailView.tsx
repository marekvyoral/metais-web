import { BreadCrumbs, HomeIcon, Tab, Tabs, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ApiVote, ApiVoteResult } from '@isdd/metais-common/api'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'

import { Collapsable } from './voteDetailComponents/collapsable/collapsable'

import { VotedTabContent } from '@/components/views/standartization/votes/vodeDetail/votedTabContent'
import styles from '@/components/views/standartization/votes/vodeDetail/voteDetail.module.scss'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { VotesHandling } from '@/components/views/standartization/votes/vodeDetail/voteDetailComponents/VotesHandling'
import { VoteDetailItems } from '@/components/views/standartization/votes/vodeDetail/voteDetailComponents/VoteDetailItems'

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

    const tabList: Tab[] = useMemo((): Tab[] => {
        const choiceResultsList = voteResultData?.choiceResults ?? []
        const actorResultsList = voteResultData?.actorResults
            ? voteResultData?.actorResults?.filter((actorResult) => actorResult?.votedChoiceId?.toString() === selectedTab)
            : []
        return choiceResultsList.map((key) => {
            return {
                id: key?.id?.toString() ?? '',
                title: getTabTitle(key?.value, key?.votedActorsCount),
                content: <VotedTabContent tableData={actorResultsList} sort={undefined} />,
            }
        })
    }, [selectedTab, voteResultData?.actorResults, voteResultData?.choiceResults])

    const handleCastVote = async (voteId: number | undefined, choiceId: number | undefined, description: string | undefined) => {
        await castVote(voteId ?? 0, choiceId ?? 0, description ?? '')
    }

    const handleVetoVote = async (voteId: number | undefined, description: string | undefined) => {
        await vetoVote(voteId ?? 0, description ?? '')
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
                <TextHeading size="XL">{voteData?.name ?? ''}</TextHeading>
                <VoteDetailItems voteData={voteData} />

                <Spacer />

                <TextHeading size="L">{t('votes.voteDetail.voteDescription')}</TextHeading>
                <TextBody>{voteData?.description ?? ''}</TextBody>

                <Spacer />

                <Collapsable
                    collapseSign={<div className={styles.collapsableSign}>-</div>}
                    expandSign={<div className={styles.collapsableSign}>+</div>}
                    heading={<div className={styles.textFormat}>Nejaky Heading</div>}
                >
                    <VotesHandling
                        voteData={voteData}
                        handleCastVote={handleCastVote}
                        handleVetoVote={handleVetoVote}
                        canCast={(isUserLoggedIn && canCastVote) ?? false}
                        canVeto={(isUserLoggedIn && canCastVote && voteData?.veto) ?? false}
                        voteProcessing={votesProcessing}
                    />
                </Collapsable>

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

                <Tabs
                    tabList={tabList}
                    onSelect={(selected) => {
                        setSelectedTab(selected.id)
                    }}
                />
            </MainContentWrapper>
        </>
    )
}
