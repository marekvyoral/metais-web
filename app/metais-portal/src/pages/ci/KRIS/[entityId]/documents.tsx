import React from 'react'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { KRISDocumentListContainer } from '@/components/containers/KRISDocumentListContainer'
import { KRISDocumentsTable } from '@/components/views/documents/KRISDocumentsTable'

const KRISDocumentsListPage: React.FC = () => {
    const { entityId } = useGetEntityParamsFromUrl()

    return (
        <KRISDocumentListContainer
            configurationItemId={entityId}
            View={(props) => {
                return <KRISDocumentsTable {...props} />
            }}
        />
    )
}

export default KRISDocumentsListPage
