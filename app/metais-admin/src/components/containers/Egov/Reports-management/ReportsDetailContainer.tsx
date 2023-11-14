import {
    CategoryHeaderList,
    ReportDefinition,
    ReportResultObject,
    ScriptExecute,
    getGetReport1QueryKey,
    useGetReport1,
    useListCategories,
    useRun,
    useSaveReport,
} from '@isdd/metais-common/api/generated/report-swagger'
import { REPORTS_LIST_QUERY_KEY } from '@isdd/metais-common/constants'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

interface IMutationError {
    message: string
}
export interface IView {
    data?: ReportDefinition
    dataCategories?: CategoryHeaderList
    saveReport: (formData: ReportDefinition) => Promise<ReportDefinition>
    runReport: (formData: ScriptExecute) => Promise<ReportResultObject>
    saveIsLoading: boolean
    mutationIsLoading: boolean
    runMutationIsSuccess: boolean
    mutationError: IMutationError
}

interface IReportsDetailContainer {
    View: React.FC<IView>
}

export const ReportsDetailContainer: React.FC<IReportsDetailContainer> = ({ View }) => {
    const { entityId } = useParams()
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const isEnabled = !!entityId

    const { isLoading: isLoadingMeta, isError: isErrorMeta, data: reportMetaData } = useGetReport1(entityId ?? '', { query: { enabled: isEnabled } })
    const { isLoading: isLoadingCategories, isError: isErrorCategories, data: dataCategories } = useListCategories()

    const getReportQueryKey = getGetReport1QueryKey(entityId ?? '')

    const {
        mutateAsync: saveMutaAsync,
        isError: saveMutationIsError,
        isSuccess: saveMutationIsSuccess,
        isLoading: saveIsLoading,
    } = useSaveReport({
        mutation: {
            onSuccess() {
                queryClient.invalidateQueries([REPORTS_LIST_QUERY_KEY])
                queryClient.invalidateQueries(getReportQueryKey)
            },
        },
    })
    const { error: mutationError, mutateAsync: runMutaAsync, isSuccess: runMutationIsSuccess, isLoading: mutationIsLoading } = useRun()
    const saveReport = async (formData: ReportDefinition) => {
        return await saveMutaAsync({
            data: {
                ...formData,
            },
        })
    }

    const runReport = async (formData: ScriptExecute) => {
        return await runMutaAsync({
            data: {
                ...formData,
            },
        })
    }

    const isLoading = (isLoadingMeta && isEnabled) || isLoadingCategories
    const isError = isErrorMeta || isErrorCategories

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View
                data={reportMetaData}
                dataCategories={dataCategories}
                saveReport={saveReport}
                runReport={runReport}
                saveIsLoading={saveIsLoading}
                mutationIsLoading={mutationIsLoading}
                runMutationIsSuccess={runMutationIsSuccess}
                mutationError={mutationError as IMutationError}
            />
            <MutationFeedback success={saveMutationIsSuccess} error={saveMutationIsError ? t('feedback.mutationErrorMessage') : undefined} />
        </QueryFeedback>
    )
}
