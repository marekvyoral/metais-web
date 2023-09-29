import { ReportDefinition } from '@isdd/metais-common/api'
import { useGetStandardRequestDetail } from '@isdd/metais-common/api/generated/standards-swagger'
import React from 'react'
import { useParams } from 'react-router-dom'

export interface IView {
    data?: ReportDefinition
    isLoading: boolean
    isError: boolean
}
interface IReportsDetailContainer {
    View: React.FC<IView>
}
export const DraftsListFormContainer: React.FC<IReportsDetailContainer> = ({ View }) => {
    const { entityId } = useParams()
    const { isLoading, isError, data } = useGetStandardRequestDetail(parseInt(entityId ?? ''))
    return <View data={data} isLoading={isLoading} isError={isError} />
}
