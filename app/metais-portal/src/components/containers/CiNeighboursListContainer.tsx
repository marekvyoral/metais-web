import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, NeighbourSetUi, NeighboursFilterContainerUi, useReadCiNeighbours } from '@isdd/metais-common/api'
import { mapFilterToNeighborsApi } from '@isdd/metais-common/api/filter/filterApi'
import { useEntityRelationshipTabFilters } from '@isdd/metais-common/hooks/useEntityRelationshipTabFilters'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { mapNeighboursSetSourceToPagination, mapNeighboursSetTargetToPagination } from '@/componentHelpers/pagination'
import { NeighboursApiType } from '@/components/containers/RelationshipFilters'

interface ICiNeighboursListContainerView {
    data?: NeighbourSetUi
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    isLoading: boolean
    isError: boolean
}

interface ICiNeighboursListContainer {
    configurationItemId?: string
    View: React.FC<ICiNeighboursListContainerView>
    apiType: NeighboursApiType
}

export const CiNeighboursListContainer: React.FC<ICiNeighboursListContainer> = ({
    configurationItemId,
    View,
    apiType = NeighboursApiType.source,
}) => {
    const { entityName } = useParams()

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
        isLoading: isEntityRelationsLoading,
        isError: isEntityRelationsError,
        defaultSourceRelationshipTabFilter,
        defaultTargetRelationshipTabFilter,
    } = useEntityRelationshipTabFilters(entityName ?? '')

    const selectedRequestApi = apiType === NeighboursApiType.source ? defaultSourceRelationshipTabFilter : defaultTargetRelationshipTabFilter

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
            data={documentCiData}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading || isEntityRelationsLoading}
            isError={isError || isEntityRelationsError}
        />
    )
}
