import React from 'react'
import { DocumentsTableView, TableCols } from '../../../../components/views/documents/DocumentsTableView'
import { EntityDocumentsContainer } from '@/components/containers/EntityDocumentContainer'
import { useParams } from 'react-router-dom'

export const Documents: React.FC = () => {
    const { entityId } = useParams()

    return (
        <EntityDocumentsContainer
            configurationItemId={entityId}
            View={(props) => {
                return <DocumentsTableView data={props?.data as TableCols[]} isLoading={props.isLoading} isError={props.isError} />
            }}
        />
    )
}
