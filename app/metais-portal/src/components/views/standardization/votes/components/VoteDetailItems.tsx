import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { ApiStandardRequest, ApiVote } from '@isdd/metais-common/api/generated/standards-swagger'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'

import { WebLinks } from '@/components/views/standardization/votes/components/WebLinks'
import { AttachmentLinks } from '@/components/views/standardization/votes/components/AttachmentLinks'
import styles from '@/components/views/standardization/votes/vote.module.scss'
import { VoteStateEnum, getVoteStateExplanation } from '@/components/views/standardization/votes/voteProps'

export interface IDetailItemData {
    itemTitleContent: string
    itemValueContent: JSX.Element
    hidden: boolean
}
export interface IDetailItemsData {
    voteData: ApiVote | undefined
    srData: ApiStandardRequest | undefined
}

export const VoteDetailItems: React.FC<IDetailItemsData> = ({ voteData, srData }) => {
    const { t } = useTranslation()

    const voteState = useMemo((): string => {
        return getVoteStateExplanation(
            voteData?.veto ? VoteStateEnum.VETOED : voteData?.voteState,
            voteData?.effectiveFrom ?? '',
            voteData?.effectiveTo ?? '',
            t,
        )
    }, [t, voteData?.effectiveFrom, voteData?.effectiveTo, voteData?.veto, voteData?.voteState])

    const hasStandardRequest = !!voteData?.standardRequestId && !!srData?.name
    const isVoteDate = !!voteData?.effectiveFrom && !!voteData?.effectiveTo
    const hasLinks = !!voteData?.links && voteData?.links.length > 0
    const hasAttachments = !!voteData?.attachments && voteData?.attachments?.length > 0

    return (
        <div className={styles.itemsTableWrapper}>
            <InformationGridRow label={t('votes.voteDetail.voteState')} value={voteState} hideIcon />
            {isVoteDate && (
                <InformationGridRow
                    label={t('votes.voteDetail.date')}
                    value={t('date', { date: voteData?.effectiveFrom }) + ' - ' + t('date', { date: voteData?.effectiveTo })}
                    hideIcon
                />
            )}
            {hasStandardRequest && <InformationGridRow label={t('votes.voteDetail.standardRequestTitle')} value={srData?.srName} hideIcon />}
            {voteData?.secret != undefined && (
                <InformationGridRow
                    label={t('votes.voteDetail.voteType')}
                    value={voteData?.secret ? t('votes.voteDetail.secret') : t('votes.voteDetail.public')}
                    hideIcon
                />
            )}
            {hasLinks && <InformationGridRow label={t('votes.voteDetail.links')} value={<WebLinks links={voteData?.links} />} hideIcon />}
            {hasAttachments && (
                <InformationGridRow
                    label={t('votes.voteDetail.relatedDocuments')}
                    value={<AttachmentLinks attachments={voteData?.attachments} />}
                    hideIcon
                />
            )}
        </div>
    )
}
