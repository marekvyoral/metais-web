import { HistoryVersionUiConfigurationItemUi, useReadCiHistoryVersion } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { CiType, useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import React from 'react'

export interface IView {
    ciTypeData: CiType | undefined
    dataFirst: HistoryVersionUiConfigurationItemUi | undefined
    dataSec: HistoryVersionUiConfigurationItemUi | undefined
}

interface IHistoryItemsCompareContainerProps {
    View: React.FC<IView>
    entityName: string
    entityId: string
    firstId: string
    secondId: string
}

export const HistoryItemsCompareContainer: React.FC<IHistoryItemsCompareContainerProps> = ({ View, entityId, entityName, firstId, secondId }) => {
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiType(entityName ?? '')
    const { data: dataFirst, isError: isErrorFirst, isLoading: isLoadingFirst } = useReadCiHistoryVersion(entityId ?? '', { versionId: firstId })
    const { data: dataSecond, isError: isErrorSec, isLoading: isLoadingSec } = useReadCiHistoryVersion(entityId ?? '', { versionId: secondId })

    const isLoading = isLoadingSec || isLoadingFirst || isCiTypeDataLoading
    const isError = isErrorFirst || isErrorSec || isCiTypeDataError

    const isNewerVersion = (first: HistoryVersionUiConfigurationItemUi, sec: HistoryVersionUiConfigurationItemUi) => {
        if (first.actionTime && sec.actionTime) {
            if (new Date(first.actionTime) > new Date(sec.actionTime)) {
                return true
            }
            return false
        }
    }

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View
                ciTypeData={ciTypeData}
                dataFirst={!isNewerVersion(dataFirst ?? {}, dataSecond ?? {}) ? dataFirst : dataSecond}
                dataSec={isNewerVersion(dataFirst ?? {}, dataSecond ?? {}) ? dataFirst : dataSecond}
            />
        </QueryFeedback>
    )
}
