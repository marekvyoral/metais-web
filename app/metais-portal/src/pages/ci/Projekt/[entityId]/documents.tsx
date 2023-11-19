import React from 'react'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { ProjectDocumentsListContainer } from '@/components/containers/ProjectDocumentListContainer'
import { ProjectDocumentsTab } from '@/components/views/documents/ProjectDocumentsTab'
import { DocumentsListContainer } from '@/components/containers/DocumentListContainer'
import { DocumentsTable } from '@/components/views/documents/DocumentsTable'

const ProjectDocumentsListPage: React.FC = () => {
    const { entityId } = useGetEntityParamsFromUrl()
    const {
        state: { user },
    } = useAuth()

    return (
        <>
            {user ? (
                <ProjectDocumentsListContainer
                    configurationItemId={entityId}
                    View={(props) => {
                        return <ProjectDocumentsTab {...props} />
                    }}
                />
            ) : (
                <DocumentsListContainer
                    configurationItemId={entityId}
                    View={(props) => {
                        return <DocumentsTable {...props} />
                    }}
                />
            )}
        </>
    )
}

export default ProjectDocumentsListPage
