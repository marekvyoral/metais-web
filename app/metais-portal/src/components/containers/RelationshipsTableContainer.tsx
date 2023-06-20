import React, { useState } from 'react'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'

import { NeighboursFilterContainerUi, useReadCiNeighboursUsingPOST } from '@/api'
import { ReadCiNeighboursUsingPOST200_GeneratedType, NeighbourPairsEntityMapped } from '@/api/types/ReadCiNeighboursUsingPOST200_GeneratedType'
import { mapFilterToNeighborsApi } from '@/componentHelpers'

interface IView {
    data?: NeighbourPairsEntityMapped[]
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    isLoading: boolean
    isError: boolean
}

interface IRelationshipsTableContainer {
    configurationItemId?: string
    View: React.FC<IView>
    defaultFilter: NeighboursFilterContainerUi
    mapData: (data: ReadCiNeighboursUsingPOST200_GeneratedType | void) => NeighbourPairsEntityMapped[] | undefined
}

export const RelationshipsTableContainer: React.FC<IRelationshipsTableContainer> = ({ configurationItemId, View, defaultFilter, mapData }) => {
    const defaultApiRequest: NeighboursFilterContainerUi = {
        ...defaultFilter,
        page: 1,
        perpage: 10,
    }

    const [apiRequest, setApiRequest] = useState<NeighboursFilterContainerUi>(defaultApiRequest)

    const handleFilterChange = (filter: IFilter) => {
        setApiRequest(mapFilterToNeighborsApi(apiRequest, filter))
    }

    const { isLoading, isError, data: documentCiData } = useReadCiNeighboursUsingPOST(configurationItemId ?? '', apiRequest, {})

    const pagination: Pagination = {
        pageNumber: apiRequest.page ?? 1,
        pageSize: apiRequest.perpage ?? 10,
        dataLength: documentCiData?.fromNodes?.pagination?.totaltems ?? 0,
    }

    if (!configurationItemId) return <View pagination={pagination} handleFilterChange={handleFilterChange} isLoading={false} isError />

    const data = mapData(documentCiData as ReadCiNeighboursUsingPOST200_GeneratedType)

    return <View data={data} pagination={pagination} handleFilterChange={handleFilterChange} isLoading={isLoading} isError={isError} />
}
