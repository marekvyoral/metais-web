import React from 'react'

import { DocumentsTable } from '@/components/views/documents/DocumentsTable'
import { DocumentsListContainer } from '@/components/containers/DocumentListContainer'
import { ProjectDocumentsListContainer } from '@/components/containers/ProjectDocumentListContainer'
import { ProjectDocumentsTab } from '@/components/views/documents/ProjectDocumentsTab'
import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

const DocumentsListPage: React.FC = () => {
    const { entityName, entityId } = useGetEntityParamsFromUrl()

    if (entityName == 'Projekt') {
        return (
            <ProjectDocumentsListContainer
                configurationItemId={entityId}
                View={(props) => {
                    return <ProjectDocumentsTab {...props} />
                }}
            />
        )
    }

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
