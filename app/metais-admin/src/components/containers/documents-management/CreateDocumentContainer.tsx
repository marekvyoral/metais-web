import { Document, DocumentGroup, useGetDocumentGroupById, useSaveDocumentHook } from '@isdd/metais-common/api/generated/kris-swagger'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useParams } from 'react-router-dom'

export interface IView {
    infoData: DocumentGroup
    saveDocument: (document: Document) => Promise<Document>
    isLoading: boolean
}

export interface ICreateDocumentContainerProps {
    View: React.FC<IView>
}

export interface DocumentFilterData extends IFilterParams {
    phase: string
    status: string
}

export const CreateDocumentContainer: React.FC<ICreateDocumentContainerProps> = ({ View }) => {
    const { entityId } = useParams()
    const id = Number(entityId)
    const { data: infoData, isLoading: isInfoLoading } = useGetDocumentGroupById(id)
    const saveDocument = useSaveDocumentHook()
    return <View isLoading={isInfoLoading} infoData={infoData ?? {}} saveDocument={saveDocument} />
}
