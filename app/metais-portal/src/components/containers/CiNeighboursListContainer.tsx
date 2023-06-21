import React, { useState } from 'react'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'

import { NeighbourSetUi, NeighboursFilterContainerUi, useReadCiNeighboursUsingPOST } from '@/api'
import { mapFilterToNeighborsApi } from '@/componentHelpers'

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
    defaultFilter: NeighboursFilterContainerUi
}

export const CiNeighboursListContainer: React.FC<ICiNeighboursListContainer> = ({ configurationItemId, View, defaultFilter }) => {
    const defaultRequestApi: NeighboursFilterContainerUi = {
        ...defaultFilter,
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
            data={documentCiData ?? undefined}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
