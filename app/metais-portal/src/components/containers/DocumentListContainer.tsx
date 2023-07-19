import React, { useState } from 'react'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { useReadCiNeighboursUsingPOST, NeighbourPairUi, BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api'

import { mapFilterToNeighborsApi } from '@/componentHelpers'
import { mapNeighboursSetSourceToPagination } from '@/componentHelpers/pagination'

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
    const defaultRequestApi = {
        neighboursFilter: {
            ciType: ['Dokument'],
            metaAttributes: { state: ['DRAFT'] },
            relType: ['CI_HAS_DOCUMENT', 'Dokument_sa_tyka_KRIS', 'CONTROL_HAS_DOCUMENT', 'PROJECT_HAS_DOCUMENT'],
            usageType: ['system', 'application'],
        },
    }

    const [uiFilterState, setUiFilterState] = useState<IFilter>({
        sort: [],
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
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
    } = useReadCiNeighboursUsingPOST(configurationItemId ?? '', mapFilterToNeighborsApi(uiFilterState, defaultRequestApi), {})

    const pagination = mapNeighboursSetSourceToPagination(uiFilterState, documentCiData)

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
