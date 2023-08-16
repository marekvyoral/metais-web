import React from 'react'

import { FindView } from '@/components/views/organizations/FindView'
import { FindContainer } from '@/components/containers/organizations/FindContainer'

const Find = () => {
    return <FindContainer View={(props) => <FindView setIcoToSearch={props?.setIcoToSearch} data={props?.data} />} />
}

export default Find
