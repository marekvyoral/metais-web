import React, { useState } from 'react'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { HistoryVersionsListUiConfigurationItemUi, useReadCiHistoryVersions } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { mapFilterToHistoryVersionsApi } from '@isdd/metais-common/componentHelpers'

import { mapConfigurationItemHistoryListToPagination } from '@/componentHelpers/pagination'

export interface IView {
    data?: HistoryVersionsListUiConfigurationItemUi
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    isLoading: boolean
    isError: boolean
}

interface IDocumentsListContainer {
    configurationItemId: string
    View: React.FC<IView>
}

export const ConfigurationItemHistoryListContainer: React.FC<IDocumentsListContainer> = ({ configurationItemId, View }) => {
    const [uiFilterState, setUiFilterState] = useState<IFilter>({
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
    })

    const handleFilterChange = (filter: IFilter) => {
        setUiFilterState({
            ...uiFilterState,
            ...filter,
        })
    }

    const {
        isLoading,
        isError,
        isFetching,
        data: historyList,
    } = useReadCiHistoryVersions(configurationItemId ?? '', mapFilterToHistoryVersionsApi(uiFilterState))

    const pagination = mapConfigurationItemHistoryListToPagination(uiFilterState, historyList)

    return (
        <View
            data={historyList}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading || isFetching}
            isError={isError}
        />
    )
}
