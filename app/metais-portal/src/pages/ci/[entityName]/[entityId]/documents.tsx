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
                return (
                    <DocumentsTable
                        namesData={props.namesData}
                        refetch={props.refetch}
                        data={props?.data}
                        handleFilterChange={props.handleFilterChange}
                        isLoading={props.isLoading}
                        isError={props.isError}
                        pagination={props.pagination}
                        selectedItems={props.selectedItems}
                        setSelectedItems={props.setSelectedItems}
                    />
                )
            }}
        />
    )
}

export default DocumentsListPage
