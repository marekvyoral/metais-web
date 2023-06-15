import React from 'react'
import { useParams } from 'react-router-dom'

import { DocumentsTable } from '@/components/views/documents/DocumentsTable'
import { DocumentsListContainer } from '@/components/containers/DocumentListContainer'

const DocumentsListPage: React.FC = () => {
    const { entityId } = useParams()

    return (
        <DocumentsListContainer
            configurationItemId={entityId}
            View={(props) => {
                return <DocumentsTable data={props?.data} isLoading={props.isLoading} isError={props.isError} />
            }}
        />
    )
}

export default DocumentsListPage
