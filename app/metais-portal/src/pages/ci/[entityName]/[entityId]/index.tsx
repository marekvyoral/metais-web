import React from 'react'
import { useParams } from 'react-router-dom'

import { DocumentsTable, TableCols } from '@/components/views/documents/DocumentsTable'
import { DocumentsListContainer } from '@/components/containers/DocumentListContainer'

export const DocumentsListPage: React.FC = () => {
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
