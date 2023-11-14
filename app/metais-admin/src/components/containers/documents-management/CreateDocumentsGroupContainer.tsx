import { EnumType, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { DocumentGroup, useSaveDocumentGroupHook } from '@isdd/metais-common/api/generated/kris-swagger'
import { STAV_PROJEKTU } from '@isdd/metais-common/constants'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'

export interface IView {
    projectStatus: EnumType
    saveDocumentGroup: (documentGroup: DocumentGroup) => Promise<DocumentGroup>
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
    const saveDocumentGroup = useSaveDocumentGroupHook()
    return <View isLoading={isStatusesLoading} projectStatus={projectStatus ?? {}} saveDocumentGroup={saveDocumentGroup} />
}
