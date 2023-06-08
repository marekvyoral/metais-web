import React from 'react'
import { DocumentsTable } from './DocumentsTable'
import { EntityDocumentsContainer } from '@/components/containers/EntityDocumentContainer'
import { useParams } from 'react-router-dom'

export const Documents: React.FC = () => {
    const { id } = useParams()

    return (
        <EntityDocumentsContainer
            configurationItemId={id}
            View={(props) => {
                return <DocumentsTable data={props?.data?.data} isLoading={props.isLoading} isError={props.isError} />
            }}
        />
    )
}
