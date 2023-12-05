import React from 'react'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { DocumentsListContainer } from '@/components/containers/DocumentListContainer'
import { DocumentsTable } from '@/components/views/documents/DocumentsTable'

const PODocumentsOutlet: React.FC = () => {
    const { entityId } = useGetEntityParamsFromUrl()

    return (
        <DocumentsListContainer
            configurationItemId={entityId}
            View={(props) => {
                return <DocumentsTable {...props} />
            }}
        />
    )
}

export default PODocumentsOutlet
