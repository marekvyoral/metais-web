import React, { useState } from 'react'
import { Pagination } from '@isdd/idsk-ui-kit/types'

import { IPageConfig } from '@/hooks/useEntityRelations'
import { NeighboursFilterContainerUi, useReadCiNeighboursUsingPOST } from '@/api'
import { ReadCiNeighboursUsingPOST200_GeneratedType, NeighbourPairsEntityMapped } from '@/api/types/ReadCiNeighboursUsingPOST200_GeneratedType'
import { mapCiDataFrom } from '@/componentHelpers'

export interface IView {
    data?: NeighbourPairsEntityMapped[]
    pagination: Pagination
    handleFilterChange: (pageNumber?: number, pageSize?: number, sortBy?: string, sortSource?: string, sortType?: string) => void
    isLoading: boolean
    isError: boolean
}

interface IDocumentsListContainer {
    configurationItemId?: string
    View: React.FC<IView>
}

export const DocumentsListContainer: React.FC<IDocumentsListContainer> = ({ configurationItemId, View }) => {
    const defaultPageConfig: IPageConfig = {
        page: 1,
        perPage: 100,
    }

    const defaultFilter: NeighboursFilterContainerUi = {
        neighboursFilter: {
            ciType: ['Dokument'],
            metaAttributes: { state: ['DRAFT'] },
            relType: ['CI_HAS_DOCUMENT', 'Dokument_sa_tyka_KRIS', 'CONTROL_HAS_DOCUMENT', 'PROJECT_HAS_DOCUMENT'],
            usageType: ['system', 'application'],
        },
        ...defaultPageConfig,
    }

    const [pageFilter, setPageFilter] = useState<NeighboursFilterContainerUi>(defaultFilter)
    const handleFilterChange = (pageNumber?: number, pageSize?: number, sortBy?: string, sortSource?: string, sortType?: string) => {
        setPageFilter({ ...pageFilter, page: pageNumber, perpage: pageSize, sortBy, sortSource, sortType })
    }
    const { isLoading, isError, data: documentCiData } = useReadCiNeighboursUsingPOST(configurationItemId ?? '', defaultFilter, {})

    const pagination: Pagination = {
        pageNumber: pageFilter.page ?? defaultPageConfig.page,
        pageSize: pageFilter.perpage ?? defaultPageConfig.perPage,
        dataLength: documentCiData?.fromNodes?.pagination?.totaltems,
    }
    if (!configurationItemId) return <View pagination={pagination} handleFilterChange={handleFilterChange} isLoading={false} isError />

    const data = mapCiDataFrom(documentCiData as ReadCiNeighboursUsingPOST200_GeneratedType)

    return <View data={data} pagination={pagination} handleFilterChange={handleFilterChange} isLoading={isLoading} isError={isError} />
}
