import { TextBody } from '@isdd/idsk-ui-kit/index'
import { ApiVote } from '@isdd/metais-common/api'
import { useTranslation } from 'react-i18next'

import { WebLinks } from '@/components/views/standartization/votes/voteDetail/voteDetailComponents/WebLinks'
import { AttachmentLinks } from '@/components/views/standartization/votes/voteDetail/voteDetailComponents/AttachmentLinks'
import styles from '@/components/views/standartization/votes/voteDetail/voteDetail.module.scss'

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

    return (
        <div className={styles.itemsTableWrapper}>
            <table className={styles.itemsTable}>
                <tbody>
                    {voteData?.effectiveFrom && voteData?.effectiveTo && (
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
                    {voteData?.secret !== undefined && (
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
                    {voteData?.links && voteData?.links.length > 0 && (
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
                    {voteData?.attachments && voteData?.attachments?.length > 0 && (
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
