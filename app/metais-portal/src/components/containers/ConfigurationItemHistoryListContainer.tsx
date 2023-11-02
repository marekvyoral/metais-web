import React, { useState } from 'react'
import { IFilter, Pagination, SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { HistoryVersionsListUiConfigurationItemUi, useReadCiHistoryVersions, useReadCiNeighbours } from '@isdd/metais-common/api'
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
        isLoading: ciNeighboursLoading,
        isError: ciNeighboursError,
        data: ciNeighboursData,
    } = useReadCiNeighbours(configurationItemId, {
        page: BASE_PAGE_NUMBER,
        perpage: BASE_PAGE_SIZE,
        sortBy: SortBy.NAME,
        sortType: SortType.ASC,
        neighboursFilter: {
            relType: ['ReferenceRegister_has_ReferenceRegisterHistory'],
            usageType: ['system'],
            metaAttributes: {
                state: ['DRAFT'],
            },
        },
    })

    const neighBourUUID = ciNeighboursData?.fromNodes?.neighbourPairs?.[0]?.configurationItem?.uuid
    const { data: historyList } = useReadCiHistoryVersions(neighBourUUID ?? '', mapFilterToHistoryVersionsApi(uiFilterState), {
        query: {
            enabled: neighBourUUID !== undefined,
        },
    })

    const pagination = mapConfigurationItemHistoryListToPagination(uiFilterState, historyList)

    return (
        <View
            data={historyList}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            isLoading={ciNeighboursLoading}
            isError={ciNeighboursError}
        />
    )
}
