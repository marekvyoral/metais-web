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
    projectStatus: EnumType
    saveDocument: (documentGroup: DocumentGroup) => Promise<DocumentGroup>
    isLoading: boolean
}

export interface ICreateDocumentsGroupContainerProps {
    View: React.FC<IView>
}

export interface DocumentFilterData extends IFilterParams {
    phase: string
    status: string
}

export const CreateDocumentsGroupContainer: React.FC<ICreateDocumentsGroupContainerProps> = ({ View }) => {
    const { data: projectStatus, isLoading: isStatusesLoading } = useGetValidEnum(STAV_PROJEKTU)
    const saveDocument = useSaveDocumentGroupHook()
    return <View isLoading={isStatusesLoading} projectStatus={projectStatus ?? {}} saveDocument={saveDocument} />
}
