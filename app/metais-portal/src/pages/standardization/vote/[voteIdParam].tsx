import React from 'react'

import { VoteEditView } from '@/components/views/standardization/votes/voteEdit/VoteEditView'
import { VoteEditContainer } from '@/components/containers/standardization/votes/VoteEditContainer'

const VoteDetail: React.FC = () => {
    return <VoteEditContainer View={(props) => <VoteEditView voteId={props.voteId} />} />
}

export default VoteDetail
