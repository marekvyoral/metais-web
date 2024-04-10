import React from 'react'
import { formatTitleString } from '@isdd/metais-common/utils/utils'
import { useTranslation } from 'react-i18next'

import { VoteDetailContainer } from '@/components/containers/standardization/votes/VoteDetailContainer'
import { VoteDetailView } from '@/components/views/standardization/votes/voteDetail/VoteDetailView'
import { VotesListPermissionsWrapper } from '@/components/permissions/VotesListPermissionsWrapper'

const VoteDetailPage: React.FC = () => {
    const { t } = useTranslation()
    return (
        <VotesListPermissionsWrapper>
            <VoteDetailContainer
                View={(props) => {
                    document.title = formatTitleString(t('votes.voteDetail.detail', { name: props.voteData?.name ?? '' }))
                    return <VoteDetailView {...props} />
                }}
            />
        </VotesListPermissionsWrapper>
    )
}

export default VoteDetailPage
