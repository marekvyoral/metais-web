import React from 'react'

import { VoteEditView } from '@/components/views/votes/VoteEditView'
import { VoteEditContainer } from '@/components/containers/votes/VoteEditContainer'

const VoteDetail: React.FC = () => {
    return <VoteEditContainer View={(props) => <VoteEditView voteId={props.voteId} />} />
}

export default VoteDetail
