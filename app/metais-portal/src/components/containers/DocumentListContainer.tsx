import React, { useState } from 'react'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'

import { NeighboursFilterContainerUi, useReadCiNeighboursUsingPOST, NeighbourPairUi } from '@/api'
import { mapFilterToNeighborsApi } from '@/componentHelpers/filter'

export interface IView {
    data?: NeighbourPairUi[]
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
    const defaultRequestApi: NeighboursFilterContainerUi = {
        neighboursFilter: {
            ciType: ['Dokument'],
            metaAttributes: { state: ['DRAFT'] },
            relType: ['CI_HAS_DOCUMENT', 'Dokument_sa_tyka_KRIS', 'CONTROL_HAS_DOCUMENT', 'PROJECT_HAS_DOCUMENT'],
            usageType: ['system', 'application'],
        },
        page: 1,
        perpage: 10,
    }

    const [requestApi, setRequestApi] = useState<NeighboursFilterContainerUi>(defaultRequestApi)
    const handleFilterChange = (filter: IFilter) => {
        setRequestApi(mapFilterToNeighborsApi(requestApi, filter))
    }
    const { isLoading, isError, data: documentCiData } = useReadCiNeighboursUsingPOST(configurationItemId ?? '', requestApi, {})

    const pagination: Pagination = {
        pageNumber: requestApi.page ?? 1,
        pageSize: requestApi.perpage ?? 10,
        dataLength: documentCiData?.fromNodes?.pagination?.totaltems ?? 0,
    }
    if (!configurationItemId) return <View pagination={pagination} handleFilterChange={handleFilterChange} isLoading={false} isError />

    return (
        <View
            data={documentCiData?.fromNodes?.neighbourPairs ?? undefined}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
