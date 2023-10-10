import React from 'react'

import { ITVSExceptionsCreateView } from '@/components/views/ci/vynimkyITVS/ITVSExceptionsCreateView'
import { CreateEntityData } from '@/components/create-entity/CreateEntity'

interface Props {
    data: CreateEntityData
}

export const ITVSExceptionsCreateContainer: React.FC<Props> = ({ data }) => {
    return <ITVSExceptionsCreateView data={data} onSubmit={() => undefined} isProcessing={false} />
}
