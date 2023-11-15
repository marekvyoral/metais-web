import { NoteVersionUi, useGetEvaluations, useGetKris, useGetRights, useGetVersions } from '@isdd/metais-common/api/generated/kris-swagger'
import React from 'react'

export interface ICiContainerView {
    versionData?: NoteVersionUi[]
    isLoading: boolean
    isError: boolean
}
interface ICiEvaluationContainer {
    entityId: string
    View: React.FC<ICiContainerView>
}

export const CiEvaluationContainer: React.FC<ICiEvaluationContainer> = ({ entityId, View }) => {
    const { data: dataRights, isError: isErrorRoles, isLoading: isLoadingRoles } = useGetRights(entityId)
    const { data: krisData, isError: isErrorKrisData, isLoading: isLoadingKrisData } = useGetKris(entityId)
    const { data: versionData, isError: isErrorVersionData, isLoading: isLoadingVersionData } = useGetVersions(entityId)

    const isLoading = [isLoadingRoles, isLoadingKrisData, isErrorVersionData].some((item) => item)
    const isError = [isErrorRoles, isErrorKrisData, isLoadingVersionData].some((item) => item)

    return <View isLoading={isLoading} isError={isError} versionData={versionData ?? []} />
}
