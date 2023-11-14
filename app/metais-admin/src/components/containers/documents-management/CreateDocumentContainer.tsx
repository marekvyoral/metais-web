import {
    Document,
    DocumentGroup,
    useGetDocumentGroupById,
    useGetDocuments,
    useSaveDocumentHook,
} from '@isdd/metais-common/api/generated/kris-swagger'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useParams } from 'react-router-dom'

export interface IView {
    infoData: DocumentGroup
    saveDocument: (document: Document) => Promise<Document>
    isLoading: boolean
    documentData: Document | undefined
}

export interface ICreateDocumentContainerProps {
    View: React.FC<IView>
}

export interface DocumentFilterData extends IFilterParams {
    phase: string
    status: string
}

export const CreateDocumentContainer: React.FC<ICreateDocumentContainerProps> = ({ View }) => {
    const { entityId, documentId } = useParams()
    const id = Number(entityId)
    const documentIdNumber = Number(documentId)
    const { data: infoData, isLoading: isInfoLoading } = useGetDocumentGroupById(id)
    const { data: documentsData, isLoading: isDocumentsDataLoading } = useGetDocuments(id)
    const saveDocument = useSaveDocumentHook()
    return (
        <View
            isLoading={isInfoLoading || isDocumentsDataLoading}
            infoData={infoData ?? {}}
            saveDocument={saveDocument}
            documentData={documentsData?.find((d) => d.id == documentIdNumber)}
        />
    )
}
