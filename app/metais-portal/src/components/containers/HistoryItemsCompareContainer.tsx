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

interface IHistoryItemsCompareContainerProps {
    View: React.FC<IView>
}

export const HistoryItemsCompareContainer: React.FC<IHistoryItemsCompareContainerProps> = ({ View }) => {
    const { firstId, secondId, entityId, entityName } = useParams()
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiType(entityName ?? '')
    const { data: dataFirst, isError: isErrorFirst, isLoading: isLoadingFirst } = useReadCiHistoryVersion(entityId ?? '', { versionId: firstId })
    const { data: dataSecond, isError: isErrorSec, isLoading: isLoadingSec } = useReadCiHistoryVersion(entityId ?? '', { versionId: secondId })

    const isLoading = isLoadingSec || isLoadingFirst || isCiTypeDataLoading
    const isError = isErrorFirst || isErrorSec || isCiTypeDataError

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View ciTypeData={ciTypeData} dataFirst={dataFirst} dataSec={dataSecond} />
        </QueryFeedback>
    )
}
