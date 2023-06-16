import React, { useState } from 'react'
import { Pagination } from '@isdd/idsk-ui-kit/types'

import { IPageConfig } from '@/hooks/useEntityRelations'
import { NeighboursFilterContainerUi, useReadCiNeighboursUsingPOST } from '@/api'
import { ReadCiNeighboursUsingPOST200_GeneratedType, NeighbourPairsEntityMapped } from '@/api/types/ReadCiNeighboursUsingPOST200_GeneratedType'

interface IView {
    data?: NeighbourPairsEntityMapped[]
    pagination: Pagination
    handleFilterChange: (pageNumber?: number, pageSize?: number, sortBy?: string, sortSource?: string, sortType?: string) => void
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
    const defaultPageConfig: IPageConfig = {
        page: 1,
        perPage: 100,
    }

    const preSetFilter: NeighboursFilterContainerUi = {
        ...defaultFilter,
        ...defaultPageConfig,
    }

    const [pageFilter, setPageFilter] = useState<NeighboursFilterContainerUi>(preSetFilter)
    const handleFilterChange = (pageNumber?: number, pageSize?: number, sortBy?: string, sortSource?: string, sortType?: string) => {
        setPageFilter({ ...pageFilter, page: pageNumber, perpage: pageSize, sortBy, sortSource, sortType })
    }

    const { isLoading, isError, data: documentCiData } = useReadCiNeighboursUsingPOST(configurationItemId ?? '', preSetFilter, {})

    const pagination: Pagination = {
        pageNumber: pageFilter.page ?? defaultPageConfig.page,
        pageSize: pageFilter.perpage ?? defaultPageConfig.perPage,
        dataLength: documentCiData?.fromNodes?.pagination?.totaltems,
    }

    if (!configurationItemId) return <View pagination={pagination} handleFilterChange={handleFilterChange} isLoading={false} isError />

    const data = mapData(documentCiData as ReadCiNeighboursUsingPOST200_GeneratedType)

    return <View data={data} pagination={pagination} handleFilterChange={handleFilterChange} isLoading={isLoading} isError={isError} />
}
