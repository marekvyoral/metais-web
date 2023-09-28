import { BreadCrumbs, HomeIcon, Tab, Table, Tabs, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ColumnSort } from '@isdd/idsk-ui-kit/types'
import { ApiVote, ApiVoteResult } from '@isdd/metais-common/api'
import { ColumnDef } from '@tanstack/react-table'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'

import styles from './voteDetail.module.scss'
import { voteDetailColumns } from './voteDetailProps'

export interface IVoteDetailView {
    voteData: ApiVote | undefined
    voteResultData: ApiVoteResult | undefined
}

const tabContent = <T,>(tableData: Array<T>, tableColumns: Array<ColumnDef<T>>, sort: ColumnSort[] | undefined): JSX.Element => {
    return (
        <>
            <Table
                data={tableData}
                columns={tableColumns}
                sort={sort ?? []}
                // onSortingChange={(columnSort) => {
                //     handleFilterChange({ sort: columnSort })
                // }}
                isLoading={false}
                error={undefined}
            />
        </>
    )
}

export const VoteDetailView: React.FC<IVoteDetailView> = ({ voteData, voteResultData }) => {
    console.log({ voteData })
    console.log({ voteResultData })

    const { t } = useTranslation()

    const getTabTitle = (textValue: string | undefined, numberValue: number | undefined): string => {
        return `${textValue ?? ''} (${numberValue ?? ''})`
    }

    const firstTabToSelect = voteResultData?.choiceResults?.[0]?.id?.toString() ?? ''
    const [selectedTab, setSelectedTab] = useState<string>(firstTabToSelect)
    const choiceResultsList = voteResultData?.choiceResults ?? []
    const actorResultsList = voteResultData?.actorResults
        ? voteResultData?.actorResults?.filter((actorResult) => actorResult?.votedChoiceId?.toString() === selectedTab)
        : []
    const tabList: Tab[] = choiceResultsList.map((key) => ({
        id: key?.id?.toString() ?? '',
        title: getTabTitle(key?.value, key?.votedActorsCount),
        content: tabContent(actorResultsList, voteDetailColumns(t), []),
    }))

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
            <TextHeading size="XL">{voteData?.name ?? ''}</TextHeading>
            <div className={styles.inline}>
                <TextBody size="L" className={styles.boldText}>
                    {t('votes.voteDetail.date')}
                </TextBody>
                <TextBody size="L">
                    {t('date', { date: voteData?.effectiveFrom })} - {t('date', { date: voteData?.effectiveTo })}
                </TextBody>
            </div>
            <div className={styles.inline}>
                <TextBody size="L" className={styles.boldText}>
                    {t('votes.voteDetail.voteType')}
                </TextBody>
                <TextBody size="L">{voteData?.secret ? t('votes.voteDetail.secret') : t('votes.voteDetail.public')}</TextBody>
            </div>
            <div className={styles.inline}>
                <TextBody size="L" className={styles.boldText}>
                    {t('votes.voteDetail.relatedDocuments')}
                </TextBody>
                <TextBody size="L">{t('date', { date: voteData?.effectiveFrom })}</TextBody>
            </div>
            <div className={styles.inline}>
                <TextBody size="L" className={styles.boldText}>
                    {t('votes.voteDetail.relatedVoteLinks')}
                </TextBody>
                <TextBody size="L">{t('date', { date: voteData?.effectiveFrom })}</TextBody>
            </div>
            <Tabs
                tabList={tabList}
                onSelect={(selected) => {
                    setSelectedTab(selected.id)
                }}
            />
        </>
    )
}
