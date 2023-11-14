import { useGetRights } from '@isdd/metais-common/api/generated/kris-swagger'
import React from 'react'

export interface ICiContainerView {
    isLoading: boolean
    isError: boolean
}
interface ICiEvaluationContainer {
    entityId: string
    View: React.FC<ICiContainerView>
}

export const CiEvaluationContainer: React.FC<ICiEvaluationContainer> = ({ entityId, View }) => {
    const { data, isError: isErrorRoles, isLoading: isLoadingRoles } = useGetRights(entityId)

    const isLoading = [isLoadingRoles].some((item) => item)
    const isError = [isErrorRoles].some((item) => item)

    return <View isLoading={isLoading} isError={isError} />
}
