import React from 'react'

import { EkoCreateContainer } from '@/components/containers/Eko/EkoCreateContainer'
import { EkoCreateView } from '@/components/views/eko/eko-create-views/EkoCreateView'

const CreateEko = () => {
    return <EkoCreateContainer View={(props) => <EkoCreateView data={props.data} mutate={props?.mutate} />} />
}

export default CreateEko
