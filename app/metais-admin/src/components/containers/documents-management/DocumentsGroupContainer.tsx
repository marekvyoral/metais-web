import { DocumentGroup } from '@isdd/metais-common/api/generated/kris-swagger'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useParams } from 'react-router-dom'

export interface IView {
    data: DocumentGroup[]
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
    return <View data={[]} />
}
