import { EnumType, useGetValidEnum } from '@isdd/metais-common/api'
import {
    DocumentGroup,
    useGetDocumentGroupById,
    useGetDocuments,
    Document,
    useSaveDocumentGroupHook,
    useDeleteDocumentGroup,
    ApiError,
    useDeleteDocumentGroupHook,
} from '@isdd/metais-common/api/generated/kris-swagger'
import { STAV_PROJEKTU } from '@isdd/metais-common/constants'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { UseMutationResult } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

export interface IView {
    infoData: DocumentGroup
    documentsData: Document[]
    projectStatus: EnumType
    saveDocument: (documentGroup: DocumentGroup) => Promise<DocumentGroup>
    deleteDocument: (id: number) => Promise<boolean>
    isLoading: boolean
}

export interface IDocumentsGroupContainerProps {
    View: React.FC<IView>
}

export interface DocumentFilterData extends IFilterParams {
    phase: string
    status: string
}

export const DocumentsGroupContainer: React.FC<IDocumentsGroupContainerProps> = ({ View }) => {
    const { entityId } = useParams()
    const id = Number(entityId)
    const { data: infoData, isLoading: isInfoLoading } = useGetDocumentGroupById(id)
    const { data: documentsData, isLoading: isDocumentsLoading } = useGetDocuments(id)
    const { data: projectStatus, isLoading: isStatusesLoading } = useGetValidEnum(STAV_PROJEKTU)
    const saveDocument = useSaveDocumentGroupHook()
    const deleteDocument = useDeleteDocumentGroupHook()
    return (
        <View
            isLoading={isDocumentsLoading || isInfoLoading || isStatusesLoading}
            infoData={infoData ?? {}}
            documentsData={documentsData ?? []}
            projectStatus={projectStatus ?? {}}
            saveDocument={saveDocument}
            deleteDocument={deleteDocument}
        />
    )
}
