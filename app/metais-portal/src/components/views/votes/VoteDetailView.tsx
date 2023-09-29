import { BreadCrumbs, HomeIcon, RadioButton, RadioGroupWithLabel, Tab, Table, Tabs, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ColumnSort } from '@isdd/idsk-ui-kit/types'
import { ApiAttachment, ApiVote, ApiVoteResult, useGetContentHook } from '@isdd/metais-common/api'
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { downloadBlobAsFile } from '@isdd/metais-common/componentHelpers/download/downloadHelper'

import styles from './voteDetail.module.scss'
import { AttachmentLinks, WebLinks, voteDetailColumns } from './voteDetailProps'
import { VotesHandling, IDetailItemData, VoteDetailItems } from './voteDetailAuxComponents'

export interface IVoteDetailView {
    voteData: ApiVote | undefined
    voteResultData: ApiVoteResult | undefined
    isUserLoggedIn: boolean
    votesProcessing: boolean
    castVote: (voteIdentifier: number, choiceId: number, description: string) => Promise<void>
    vetoVote: (voteIdentifier: number, description: string) => Promise<void>
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

export const VoteDetailView: React.FC<IVoteDetailView> = ({ voteData, isUserLoggedIn, voteResultData, castVote, vetoVote, votesProcessing }) => {
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
                content: tabContent(actorResultsList, voteDetailColumns(t), []),
            }
        })
    }, [selectedTab, t, voteResultData?.actorResults, voteResultData?.choiceResults])

    const downloadAttachmentFile = useGetContentHook()
    const [isFileLoading, setFileLoading] = useState<boolean>(false)
    const downloadAttachment = async (attachment: ApiAttachment) => {
        const blobData = await downloadAttachmentFile(attachment.attachmentId ?? '')
        downloadBlobAsFile(new Blob([blobData]), attachment.attachmentName ?? '')
        setFileLoading(false)
    }
    const handleCastVote = async (voteId: number | undefined, choiceId: number | undefined, description: string | undefined) => {
        await castVote(voteId ?? 0, choiceId ?? 0, description ?? '')
    }

    const handleVetoVote = async (voteId: number | undefined, description: string | undefined) => {
        await vetoVote(voteId ?? 0, description ?? '')
    }

    const detailItemsTableData: IDetailItemData[] = [
        {
            itemTitleContent: t('votes.voteDetail.date'),
            itemValueContent: (
                <TextBody size="L" className={styles.itemsTableCellContent}>
                    {t('date', { date: voteData?.effectiveFrom }) + ' - ' + t('date', { date: voteData?.effectiveTo })}
                </TextBody>
            ),
            hidden: voteData?.effectiveFrom === undefined || voteData?.effectiveTo === undefined,
        },
        {
            itemTitleContent: t('votes.voteDetail.voteType'),
            itemValueContent: (
                <TextBody size="L" className={styles.itemsTableCellContent}>
                    {voteData?.secret ? t('votes.voteDetail.secret') : t('votes.voteDetail.public')}
                </TextBody>
            ),
            hidden: voteData?.secret === undefined,
        },
        {
            itemTitleContent: t('votes.voteDetail.relatedVoteLinks'),
            itemValueContent: <WebLinks links={voteData?.links} />,
            hidden: voteData?.links === undefined || voteData?.links?.length === 0,
        },
        {
            itemTitleContent: t('votes.voteDetail.relatedDocuments'),
            itemValueContent: <AttachmentLinks attachments={voteData?.attachments} downloadFile={downloadAttachment} />,
            hidden: voteData?.attachments === undefined || voteData?.attachments?.length === 0,
        },
    ]

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
            <VoteDetailItems tableData={detailItemsTableData} />

            <div className={styles.spaceVertical} />

            <TextHeading size="L">{t('votes.voteDetail.voteDescription')}</TextHeading>
            <TextBody>{voteData?.description ?? ''}</TextBody>

            <div className={styles.spaceVertical} />

            <TextHeading size="L">{t('votes.voteDetail.votesHandlingTitle')}</TextHeading>
            <VotesHandling
                voteData={voteData}
                handleCastVote={handleCastVote}
                handleVetoVote={handleVetoVote}
                canCast={(isUserLoggedIn && voteData?.canCast) ?? false}
                canVeto={(isUserLoggedIn && voteData?.canCast && voteData?.veto) ?? false}
                voteProcessing={votesProcessing}
            />

            <div className={styles.spaceVertical} />

            <Tabs
                tabList={tabList}
                onSelect={(selected) => {
                    setSelectedTab(selected.id)
                }}
            />
        </>
    )
}
