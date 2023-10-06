import { TextBody } from '@isdd/idsk-ui-kit/index'
import { ApiVote, ApiVoteResult } from '@isdd/metais-common/api'
import { useTranslation } from 'react-i18next'

import styles from '@/components/views/standardization/votes/voteDetail/voteDetail.module.scss'

export interface IOverviewItemData {
    itemTitleContent: string
    itemValueContent: JSX.Element
    hidden: boolean
}
export interface IOverviewItemsData {
    voteData: ApiVote | undefined
    voteResultData: ApiVoteResult | undefined
}

export const VoteOverViewItems: React.FC<IOverviewItemsData> = ({ voteData, voteResultData }) => {
    const { t } = useTranslation()

    return (
        <div className={styles.itemsTableWrapper}>
            <table className={styles.itemsTable}>
                <tbody>
                    {voteData?.actionDesription ||
                        (voteData?.veto && (
                            <tr className={styles.itemsTableRow}>
                                <td>
                                    <TextBody size="L" className={styles.itemTitle}>
                                        {t('votes.voteDetail.voteConclusion')}:
                                    </TextBody>
                                </td>
                                <td>
                                    <TextBody size="L" className={styles.itemsTableCellContent}>
                                        {voteData?.veto ? t('votes.voteDetail.vetoed') : voteData?.actionDesription}
                                    </TextBody>
                                </td>
                            </tr>
                        ))}
                    {voteResultData?.vetoedBy && (
                        <tr className={styles.itemsTableRow}>
                            <td>
                                <TextBody size="L" className={styles.itemTitle}>
                                    {t('votes.voteDetail.vetoedBy')}:
                                </TextBody>
                            </td>
                            <td>
                                <TextBody size="L" className={styles.itemsTableCellContent}>
                                    {voteResultData?.vetoedBy}
                                </TextBody>
                            </td>
                        </tr>
                    )}
                    {voteResultData?.vetoedDescription && (
                        <tr className={styles.itemsTableRow}>
                            <td>
                                <TextBody size="L" className={styles.itemTitle}>
                                    {t('votes.voteDetail.vetoedDescription')}:
                                </TextBody>
                            </td>
                            <td>
                                <TextBody size="L" className={styles.itemsTableCellContent}>
                                    {voteResultData?.vetoedDescription}
                                </TextBody>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
