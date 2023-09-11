import React from 'react'
import { useParams } from 'react-router-dom'

import { EkoDetailContainer } from '@/components/containers/Eko/EkoDetailContainer'
import { EkoDetailView } from '@/components/views/eko/eko-detail-views/EkoDetailView'

const EkoCode = () => {
    const { ekoCode } = useParams()

    return <EkoDetailContainer ekoCode={ekoCode ?? ''} View={(ekoCodeDetail) => <EkoDetailView data={ekoCodeDetail.data} />} />
}

export default EkoCode
