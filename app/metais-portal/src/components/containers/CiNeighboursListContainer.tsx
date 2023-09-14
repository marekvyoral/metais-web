import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, NeighbourSetUi, NeighboursFilterUi, useReadCiNeighbours } from '@isdd/metais-common/api'
import { INeighboursFilter, mapFilterToRelationApi } from '@isdd/metais-common/api/filter/filterApi'
import { useEntityRelationshipTabFilters } from '@isdd/metais-common/hooks/useEntityRelationshipTabFilters'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { mapNeighboursSetSourceToPagination, mapNeighboursSetTargetToPagination } from '@/componentHelpers/pagination'
import { NeighboursApiType } from '@/components/containers/RelationshipFilters'

interface ICiNeighboursListContainerView {
    data?: NeighbourSetUi
    pagination: Pagination
    filter?: IFilter
    apiFilterData?: NeighboursFilterUi
    handleFilterChange: (filter: INeighboursFilter) => void
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

    const [uiFilterState, setUiFilterState] = useState<INeighboursFilter>({
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
        sort: [],
    })

    const handleFilterChange = (filter: INeighboursFilter) => {
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
    } = useReadCiNeighbours(configurationItemId ?? '', mapFilterToRelationApi(uiFilterState, selectedRequestApi), {})

    const pagination =
        apiType === NeighboursApiType.source
            ? mapNeighboursSetSourceToPagination(uiFilterState, documentCiData)
            : mapNeighboursSetTargetToPagination(uiFilterState, documentCiData)

    if (!configurationItemId) return <View pagination={pagination} handleFilterChange={handleFilterChange} isLoading={false} isError />
    return (
        <View
            data={documentCiData}
            pagination={pagination}
            filter={uiFilterState}
            apiFilterData={selectedRequestApi.neighboursFilter}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading || isEntityRelationsLoading}
            isError={isError || isEntityRelationsError}
        />
    )
}
