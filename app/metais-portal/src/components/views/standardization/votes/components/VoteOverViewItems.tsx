import { useTranslation } from 'react-i18next'
import { ApiVote, ApiVoteResult } from '@isdd/metais-common/api/generated/standards-swagger'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'

import styles from '@/components/views/standardization/votes/vote.module.scss'

export interface IOverviewItemData {
    itemTitleContent: string
    itemValueContent: JSX.Element
    hidden: boolean
}
export interface IOverviewItemsData {
    voteData?: ApiVote
    voteResultData?: ApiVoteResult
}
export const VoteOverViewItems: React.FC<IOverviewItemsData> = ({ voteData, voteResultData }) => {
    const { t } = useTranslation()

    return (
        <div className={styles.itemsTableWrapper}>
            {!voteData?.veto && voteData?.actionDesription && (
                <InformationGridRow label={t('votes.voteDetail.voteConclusion')} value={voteData?.actionDesription} hideIcon />
            )}
            {voteData?.veto && <InformationGridRow label={t('votes.voteDetail.voteConclusion')} value={t('votes.voteDetail.vetoed')} hideIcon />}
            {voteResultData?.vetoedBy && <InformationGridRow label={t('votes.voteDetail.vetoedBy')} value={voteResultData?.vetoedBy} hideIcon />}
            {voteResultData?.vetoedDescription && (
                <InformationGridRow label={t('votes.voteDetail.vetoedDescription')} value={voteResultData?.vetoedDescription} hideIcon />
            )}
        </div>
    )
}
