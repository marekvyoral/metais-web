import { useParams } from 'react-router-dom'

import { RefIdentifierDetailContainer } from '@/components/containers/ref-identifiers/RefIdentifierDetailContainer'

const RefIdentifierDetailPage = () => {
    const { id } = useParams()

    return (
        <>
            <RefIdentifierDetailContainer id={id ?? ''} />
        </>
    )
}

export default RefIdentifierDetailPage
