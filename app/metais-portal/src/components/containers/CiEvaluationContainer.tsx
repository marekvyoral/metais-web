import {
    KrisToBeRights,
    KrisUi,
    NoteVersionUi,
    useAddEvaluationHook,
    useAddResponseHook,
    useGetKris,
    useGetRights,
    useGetVersions,
    useUpdateManualApprovmentHook,
} from '@isdd/metais-common/api/generated/kris-swagger'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { IResultCall } from '@/components/views/evaluation/EvaluationView'

export enum EContainerType {
    COMMON = 'COMMON',
    GOALS = 'GOALS',
    KRIS = 'KRIS',
    KS = 'KS',
    ISVS = 'ISVS',
}
export interface ICiContainerView {
    versionData?: NoteVersionUi[]
    dataRights?: KrisToBeRights
    krisData?: KrisUi
    isLoading: boolean
    isError: boolean
    resultSuccessApiCall: IResultCall
    resetResultSuccessApiCall: () => void
    onApprove: (approve: boolean) => void
    onApproveGoals: (approve: boolean, note: string, type: EContainerType, refetchData: () => void) => void
    onResponseGoals: (note: string, refetchData: () => void) => void
}

interface ICiEvaluationContainer {
    entityId: string
    View: React.FC<ICiContainerView>
}

export const CiEvaluationContainer: React.FC<ICiEvaluationContainer> = ({ entityId, View }) => {
    const { t } = useTranslation()
    const { data: dataRights, isError: isErrorRoles, isLoading: isLoadingRoles } = useGetRights(entityId)
    const { data: versionData, isError: isErrorVersionData, isLoading: isLoadingVersionData } = useGetVersions(entityId)

    const [isApproveLoading, setApproveLoading] = useState<boolean>(false)
    const [isApproveError, setApproveError] = useState<string>()
    const approveHook = useUpdateManualApprovmentHook()
    const responseHook = useAddResponseHook()
    const addEvaluationHook = useAddEvaluationHook()
    const [resultSuccessApiCall, setResultSuccessApiCall] = useState<IResultCall>({ isSuccess: false, message: '' })
    const { data: krisData, isError: isErrorKrisData, isLoading: isLoadingKrisData, refetch: refetchKrisData, isFetching } = useGetKris(entityId)

    const handleApprove = (approve: boolean) => {
        setApproveLoading(true)
        approveHook(entityId, { manualApproved: approve })
            .then(() => {
                refetchKrisData()
                setResultSuccessApiCall({ isSuccess: true, message: t('evaluation.saveSuccess') })
            })
            .catch((err) => {
                setApproveError(err)
            })
            .finally(() => {
                setApproveLoading(false)
            })
    }
    const handleApproveGoals = (approve: boolean, note: string, type: EContainerType, refetchData: () => void) => {
        setApproveLoading(true)
        addEvaluationHook(entityId, entityId, type, {
            state: { values: [{ name: 'common', value: approve }] },
            values: [{ name: 'common', value: note }],
        })
            .then(() => {
                refetchData()
                setResultSuccessApiCall({ isSuccess: true, message: t('evaluation.saveSuccess') })
            })
            .catch((err) => {
                setApproveError(err)
            })
            .finally(() => {
                setApproveLoading(false)
            })
    }

    const handleResponseGoals = (note: string, refetchData: () => void) => {
        setApproveLoading(true)
        responseHook(entityId, entityId, 'GOALS', {
            values: [{ name: 'common', value: note }],
        })
            .then(() => {
                refetchData()
                setResultSuccessApiCall({ isSuccess: true, message: t('evaluation.saveSuccess') })
            })
            .catch((err) => {
                setApproveError(err)
            })
            .finally(() => {
                setApproveLoading(false)
            })
    }

    const isLoading = [isLoadingRoles, isLoadingVersionData, isApproveLoading, isLoadingKrisData, isFetching].some((item) => item)
    const isError = [isErrorRoles, isErrorVersionData, isApproveError, isErrorKrisData].some((item) => item)

    const resetResultSuccessApiCall = () => {
        setResultSuccessApiCall({ isSuccess: false, message: '' })
    }

    return (
        <View
            isLoading={isLoading}
            isError={isError}
            versionData={versionData ?? []}
            onApprove={handleApprove}
            onApproveGoals={handleApproveGoals}
            onResponseGoals={handleResponseGoals}
            dataRights={dataRights}
            krisData={krisData}
            resultSuccessApiCall={resultSuccessApiCall}
            resetResultSuccessApiCall={resetResultSuccessApiCall}
        />
    )
}
