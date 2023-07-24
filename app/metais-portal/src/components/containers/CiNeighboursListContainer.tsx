import React, { useState } from 'react'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, ReadCiNeighbours200, NeighboursFilterContainerUi, useReadCiNeighbours } from '@isdd/metais-common/api'

import {
    defaultTargetRelationshipTabFilter,
    defaultSourceRelationshipTabFilter,
    NeighboursApiType,
} from '@/components/containers/RelationshipFilters'
import { mapFilterToNeighborsApi } from '@/componentHelpers'
import { mapNeighboursSetSourceToPagination, mapNeighboursSetTargetToPagination } from '@/componentHelpers/pagination'

interface ICiNeighboursListContainerView {
    data?: ReadCiNeighbours200
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    isLoading: boolean
    isError: boolean
}

interface ICiNeighboursListContainer {
    configurationItemId?: string
    View: React.FC<ICiNeighboursListContainerView>
    apiType?: NeighboursApiType
}

export const CiNeighboursListContainer: React.FC<ICiNeighboursListContainer> = ({
    configurationItemId,
    View,
    apiType = NeighboursApiType.source,
}) => {
    const selectedRequestApi = apiType === NeighboursApiType.source ? defaultSourceRelationshipTabFilter : defaultTargetRelationshipTabFilter

    const [uiFilterState, setUiFilterState] = useState<IFilter>({
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
        sort: [],
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
        data: documentCiData,
    } = useReadCiNeighbours(configurationItemId ?? '', mapFilterToNeighborsApi<NeighboursFilterContainerUi>(uiFilterState, selectedRequestApi), {})

    const pagination =
        apiType === NeighboursApiType.source
            ? mapNeighboursSetSourceToPagination(uiFilterState, documentCiData)
            : mapNeighboursSetTargetToPagination(uiFilterState, documentCiData)

    if (!configurationItemId) return <View pagination={pagination} handleFilterChange={handleFilterChange} isLoading={false} isError />
    return (
        <View
            data={documentCiData ?? undefined}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
