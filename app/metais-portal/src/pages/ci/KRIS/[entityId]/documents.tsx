import React from 'react'

import { DocumentsTable } from '@/components/views/documents/DocumentsTable'
import { DocumentsListContainer } from '@/components/containers/DocumentListContainer'
import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

const DocumentsListPage: React.FC = () => {
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

export default DocumentsListPage
