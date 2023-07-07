import React from 'react'

import CreateEntityContainer from '@/components/containers/Egov/Entity/CreateEntityContainer'
import { CreateEntityView } from '@/components/views/egov/entity-detail-views/CreateEntityView'

type Props = {}

const create = (props: Props) => {
    return <CreateEntityContainer View={(props) => <CreateEntityView data={props?.data} mutate={props?.mutate} />} />
}

export default create
