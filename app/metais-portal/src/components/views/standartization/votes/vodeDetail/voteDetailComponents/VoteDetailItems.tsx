import { TextBody } from '@isdd/idsk-ui-kit/index'
import { ApiVote } from '@isdd/metais-common/api'
import { useTranslation } from 'react-i18next'

import { WebLinks } from '@/components/views/standartization/votes/vodeDetail/voteDetailComponents/WebLinks'
import { AttachmentLinks } from '@/components/views/standartization/votes/vodeDetail/voteDetailComponents/AttachmentLinks'
import styles from '@/components/views/standartization/votes/vodeDetail/voteDetail.module.scss'

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

    const tableData: IDetailItemData[] = [
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
            itemValueContent: <AttachmentLinks attachments={voteData?.attachments} />,
            hidden: voteData?.attachments === undefined || voteData?.attachments?.length === 0,
        },
    ]

    const tableDataToShow = tableData.filter((data) => data.hidden === false)

    console.log('som sa refreshol....')
    return (
        <div className={styles.itemsTableWrapper}>
            <table className={styles.itemsTable}>
                <tbody>
                    {tableDataToShow.map((detailItemData, index) => {
                        return (
                            <tr key={'itemData' + index} className={styles.itemsTableRow}>
                                <td>
                                    <TextBody size="L" className={styles.itemTitle}>
                                        {detailItemData.itemTitleContent}:
                                    </TextBody>
                                </td>
                                <td>{detailItemData.itemValueContent}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
