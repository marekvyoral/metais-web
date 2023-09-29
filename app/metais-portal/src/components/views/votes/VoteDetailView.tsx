import { BreadCrumbs, HomeIcon, Tab, Tabs, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ApiAttachment, ApiVote, ApiVoteResult, useGetContentHook } from '@isdd/metais-common/api'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { downloadBlobAsFile } from '@isdd/metais-common/componentHelpers/download/downloadHelper'

import styles from './voteDetail.module.scss'
import { AttachmentLinks, WebLinks, voteDetailColumns } from './voteDetailProps'
import { VotesHandling, IDetailItemData, VoteDetailItems, votedTabContent } from './voteDetailAuxComponents'

import { MainContentWrapper } from '@/components/MainContentWrapper'

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
                content: votedTabContent(actorResultsList, voteDetailColumns(t), []),
            }
        })
    }, [selectedTab, t, voteResultData?.actorResults, voteResultData?.choiceResults])

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

                <div className={styles.spaceVertical} />

                <TextHeading size="L">{t('votes.voteDetail.voteDescription')}</TextHeading>
                <TextBody>{voteData?.description ?? ''}</TextBody>

                <div className={styles.spaceVertical} />

                <TextHeading size="L">{t('votes.voteDetail.votesHandlingTitle')}</TextHeading>
                <VotesHandling
                    voteData={voteData}
                    handleCastVote={handleCastVote}
                    handleVetoVote={handleVetoVote}
                    canCast={(isUserLoggedIn && canCastVote) ?? false}
                    canVeto={(isUserLoggedIn && canCastVote && voteData?.veto) ?? false}
                    voteProcessing={votesProcessing}
                />

                <div className={styles.spaceVertical} />

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
