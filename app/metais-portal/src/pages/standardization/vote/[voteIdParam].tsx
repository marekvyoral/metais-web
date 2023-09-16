import React from 'react'

import { VoteDetailContainer } from '@/components/containers/votes/VoteDetailContainer'
import { VoteEditView } from '@/components/views/votes/VoteEditView'

const VoteDetail: React.FC = () => {
    return <VoteDetailContainer View={(props) => <VoteEditView voteId={props.voteId} />} />
}

export default VoteDetail
