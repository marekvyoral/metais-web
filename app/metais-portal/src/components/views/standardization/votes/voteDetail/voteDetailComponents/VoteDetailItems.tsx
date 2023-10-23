import { TextBody } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { ApiVote } from '@isdd/metais-common/api/generated/standards-swagger'

import { WebLinks } from '@/components/views/standardization/votes/voteDetail/voteDetailComponents/WebLinks'
import { AttachmentLinks } from '@/components/views/standardization/votes/voteDetail/voteDetailComponents/AttachmentLinks'
import styles from '@/components/views/standardization/votes/voteDetail/voteDetail.module.scss'
import { getVoteStateExplanation } from '@/components/views/standardization/votes/voteProps'

export interface IDetailItemData {
    itemTitleContent: string
    itemValueContent: JSX.Element
    hidden: boolean
}
export interface IDetailItemsData {
    voteData: ApiVote | undefined
}

export const VoteDetailItems: React.FC<IDetailItemsData> = ({ voteData }) => {
    const { t } = useTranslation()

    const getVoteStateExplanationForDetail = useMemo((): string => {
        return getVoteStateExplanation(voteData?.voteState, voteData?.effectiveFrom ?? '', voteData?.effectiveTo ?? '', t)
    }, [t, voteData?.effectiveFrom, voteData?.effectiveTo, voteData?.voteState])

    const isVoteDate = voteData?.effectiveFrom && voteData?.effectiveTo
    const hasLinks = voteData?.links && voteData?.links.length > 0
    const hasAttachments = voteData?.attachments && voteData?.attachments?.length > 0

    return (
        <div className={styles.itemsTableWrapper}>
            <table className={styles.itemsTable}>
                <tbody>
                    <tr className={styles.itemsTableRow}>
                        <td>
                            <TextBody size="L" className={styles.itemTitle}>
                                {t('votes.voteDetail.voteDetailExplanationPrefix')}:
                            </TextBody>
                        </td>
                        <td>
                            <TextBody size="L" className={styles.itemTitle}>
                                {getVoteStateExplanationForDetail}
                            </TextBody>
                        </td>
                    </tr>

                    {isVoteDate && (
                        <tr className={styles.itemsTableRow}>
                            <td>
                                <TextBody size="L" className={styles.itemTitle}>
                                    {t('votes.voteDetail.date')}:
                                </TextBody>
                            </td>
                            <td>
                                <TextBody size="L" className={styles.itemsTableCellContent}>
                                    {t('date', { date: voteData?.effectiveFrom }) + ' - ' + t('date', { date: voteData?.effectiveTo })}
                                </TextBody>
                            </td>
                        </tr>
                    )}
                    {voteData?.secret != undefined && (
                        <tr className={styles.itemsTableRow}>
                            <td>
                                <TextBody size="L" className={styles.itemTitle}>
                                    {t('votes.voteDetail.voteType')}:
                                </TextBody>
                            </td>
                            <td>
                                <TextBody size="L" className={styles.itemsTableCellContent}>
                                    {voteData?.secret ? t('votes.voteDetail.secret') : t('votes.voteDetail.public')}
                                </TextBody>
                            </td>
                        </tr>
                    )}
                    {hasLinks && (
                        <tr className={styles.itemsTableRow}>
                            <td>
                                <TextBody size="L" className={styles.itemTitle}>
                                    {t('votes.voteDetail.relatedVoteLinks')}:
                                </TextBody>
                            </td>
                            <td>
                                <WebLinks links={voteData?.links} />
                            </td>
                        </tr>
                    )}
                    {hasAttachments && (
                        <tr className={styles.itemsTableRow}>
                            <td>
                                <TextBody size="L" className={styles.itemTitle}>
                                    {t('votes.voteDetail.relatedDocuments')}:
                                </TextBody>
                            </td>
                            <td>
                                <AttachmentLinks attachments={voteData?.attachments} />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
