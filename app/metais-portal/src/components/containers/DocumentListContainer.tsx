import React, { useState } from 'react'
import { Pagination } from '@isdd/idsk-ui-kit/types'

import { NeighboursFilterContainerUi, useReadCiNeighboursUsingPOST } from '@/api'
import { ReadCiNeighboursUsingPOST200_GeneratedType, NeighbourPairsEntityMapped } from '@/api/types/ReadCiNeighboursUsingPOST200_GeneratedType'
import { mapCiDataFrom, mapFilterToNeighborsApi } from '@/componentHelpers'
import { IFilter } from '@/types/filter'

export interface IView {
    data?: NeighbourPairsEntityMapped[]
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    isLoading: boolean
    isError: boolean
}

interface IDocumentsListContainer {
    configurationItemId?: string
    View: React.FC<IView>
}

export const DocumentsListContainer: React.FC<IDocumentsListContainer> = ({ configurationItemId, View }) => {
    const defaultApiRequest: NeighboursFilterContainerUi = {
        neighboursFilter: {
            ciType: ['Dokument'],
            metaAttributes: { state: ['DRAFT'] },
            relType: ['CI_HAS_DOCUMENT', 'Dokument_sa_tyka_KRIS', 'CONTROL_HAS_DOCUMENT', 'PROJECT_HAS_DOCUMENT'],
            usageType: ['system', 'application'],
        },
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

    const data = mapCiDataFrom(documentCiData as ReadCiNeighboursUsingPOST200_GeneratedType)

    return <View data={data} pagination={pagination} handleFilterChange={handleFilterChange} isLoading={isLoading} isError={isError} />
}
