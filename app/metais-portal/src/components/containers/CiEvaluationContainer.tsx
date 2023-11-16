import {
    KrisToBeRights,
    NoteVersionUi,
    useAddEvaluationHook,
    useAddResponseHook,
    useGetEvaluations,
    useGetKris,
    useGetRights,
    useGetVersions,
    useUpdateManualApprovmentHook,
} from '@isdd/metais-common/api/generated/kris-swagger'
import React, { useState } from 'react'

export interface ICiContainerView {
    versionData?: NoteVersionUi[]
    dataRights?: KrisToBeRights
    isLoading: boolean
    isError: boolean
    onApprove: (approve: boolean) => Promise<void>
    onApproveGoals: (approve: boolean, note: string, refetchData: () => void) => Promise<void>
    onResponseGoals: (note: string, refetchData: () => void) => Promise<void>
}
interface ICiEvaluationContainer {
    entityId: string
    View: React.FC<ICiContainerView>
}

export const CiEvaluationContainer: React.FC<ICiEvaluationContainer> = ({ entityId, View }) => {
    const { data: dataRights, isError: isErrorRoles, isLoading: isLoadingRoles } = useGetRights(entityId)
    const { data: krisData, isError: isErrorKrisData, isLoading: isLoadingKrisData } = useGetKris(entityId)
    const { data: versionData, isError: isErrorVersionData, isLoading: isLoadingVersionData } = useGetVersions(entityId)
    const [isApproveLoading, setApproveLoading] = useState<boolean>(false)
    const [isApproveError, setApproveError] = useState<string>()
    const approveHook = useUpdateManualApprovmentHook()
    const responseHook = useAddResponseHook()
    const addEvaluationHook = useAddEvaluationHook()

    const handleApprove = async (approve: boolean) => {
        setApproveLoading(true)
        await approveHook(entityId, { manualApproved: approve })
            .then(() => {
                return
            })
            .catch((err) => {
                setApproveError(err)
            })
            .finally(() => {
                setApproveLoading(false)
            })
    }
    const handleApproveGoals = async (approve: boolean, note: string, refetchData: () => void) => {
        setApproveLoading(true)
        await addEvaluationHook(entityId, entityId, 'GOALS', {
            state: { values: [{ name: 'common', value: approve }] },
            values: [{ name: 'common', value: note }],
        })
            .then(() => {
                refetchData()
            })
            .catch((err) => {
                setApproveError(err)
            })
            .finally(() => {
                setApproveLoading(false)
            })
    }

    const handleResponseGoals = async (note: string, refetchData: () => void) => {
        setApproveLoading(true)
        await responseHook(entityId, entityId, 'GOALS', {
            values: [{ name: 'common', value: note }],
        })
            .then(() => {
                refetchData()
            })
            .catch((err) => {
                setApproveError(err)
            })
            .finally(() => {
                setApproveLoading(false)
            })
    }

    const isLoading = [isLoadingRoles, isLoadingKrisData, isLoadingVersionData, isApproveLoading].some((item) => item)
    const isError = [isErrorRoles, isErrorKrisData, isErrorVersionData, isApproveError].some((item) => item)

    return (
        <View
            isLoading={isLoading}
            isError={isError}
            versionData={versionData ?? []}
            onApprove={handleApprove}
            onApproveGoals={handleApproveGoals}
            onResponseGoals={handleResponseGoals}
            dataRights={dataRights}
        />
    )
}
