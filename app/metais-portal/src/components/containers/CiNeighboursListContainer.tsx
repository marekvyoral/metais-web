import React, { useState } from 'react'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, NeighbourSetUi, NeighboursFilterContainerUi, useReadCiNeighboursUsingPOST } from '@isdd/metais-common/api'

import {
    defaultTargetRelationshipTabFilter,
    defaultSourceRelationshipTabFilter,
    NeighboursApiType,
} from '@/components/containers/RelationshipFilters'
import { mapFilterToNeighborsApi } from '@/componentHelpers'
import { mapNeighboursSetSourceToPagination, mapNeighboursSetTargetToPagination } from '@/componentHelpers/pagination'

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
    apiType?: NeighboursApiType
}

export const CiNeighboursListContainer: React.FC<ICiNeighboursListContainer> = ({
    configurationItemId,
    View,
    apiType = NeighboursApiType.source,
}) => {
    const selectedRequestApi = apiType === NeighboursApiType.source ? defaultSourceRelationshipTabFilter : defaultTargetRelationshipTabFilter
    const defaultRequestApi: NeighboursFilterContainerUi = {
        ...selectedRequestApi,
        page: BASE_PAGE_NUMBER,
        perpage: BASE_PAGE_SIZE,
    }

    const [requestApi, setRequestApi] = useState<NeighboursFilterContainerUi>(defaultRequestApi)

    const handleFilterChange = (filter: IFilter) => {
        setRequestApi(mapFilterToNeighborsApi(requestApi, filter))
    }

    const { isLoading, isError, data: documentCiData } = useReadCiNeighboursUsingPOST(configurationItemId ?? '', requestApi, {})

    const pagination =
        apiType === NeighboursApiType.source
            ? mapNeighboursSetSourceToPagination(requestApi, documentCiData)
            : mapNeighboursSetTargetToPagination(requestApi, documentCiData)

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
