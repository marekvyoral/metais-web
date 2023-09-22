import { HistoryVersionUiConfigurationItemUi, useReadCiHistoryVersion } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { CiType, useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import React from 'react'
import { useParams } from 'react-router-dom'

export interface IView {
    ciTypeData: CiType | undefined
    dataFirst: HistoryVersionUiConfigurationItemUi | undefined
    dataSec: HistoryVersionUiConfigurationItemUi | undefined
}

interface IHistorySingleItemCompareContainerProps {
    View: React.FC<IView>
}

export const HistorySingleItemCompareContainer: React.FC<IHistorySingleItemCompareContainerProps> = ({ View }) => {
    const { firstId, entityId, entityName } = useParams()
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiType(entityName ?? '')
    const { data: dataFirst, isError: isErrorFirst, isLoading: isLoadingFirst } = useReadCiHistoryVersion(entityId ?? '', { versionId: firstId })

    const isLoading = isLoadingFirst || isCiTypeDataLoading
    const isError = isErrorFirst || isCiTypeDataError

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View ciTypeData={ciTypeData} dataFirst={dataFirst} dataSec={undefined} />
        </QueryFeedback>
    )
}