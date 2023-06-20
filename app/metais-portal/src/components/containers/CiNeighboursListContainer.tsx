import React, { SetStateAction, useState } from 'react'

import { IPageConfig } from '@/hooks/useEntityRelations'
import { NeighbourSetUi, NeighboursFilterContainerUi, useReadCiNeighboursUsingPOST } from '@/api'

interface ICiNeighboursListContainerView {
    data?: NeighbourSetUi
    setPageConfig: React.Dispatch<SetStateAction<IPageConfig>>
    isLoading: boolean
    isError: boolean
}

interface ICiNeighboursListContainer {
    configurationItemId?: string
    View: React.FC<ICiNeighboursListContainerView>
    defaultFilter: NeighboursFilterContainerUi
}

export const CiNeighboursListContainer: React.FC<ICiNeighboursListContainer> = ({ configurationItemId, View, defaultFilter }) => {
    const defaultPageConfig: IPageConfig = {
        page: 1,
        perPage: 100,
    }
    const [pageConfig, setPageConfig] = useState<IPageConfig>(defaultPageConfig)

    const preSetFilter: NeighboursFilterContainerUi = {
        ...defaultFilter,
        ...pageConfig,
    }

    const { isLoading, isError, data: documentCiData } = useReadCiNeighboursUsingPOST(configurationItemId ?? '', preSetFilter, {})

    if (!configurationItemId) return <View setPageConfig={setPageConfig} isLoading={false} isError />
    return <View data={documentCiData ?? undefined} setPageConfig={setPageConfig} isLoading={isLoading} isError={isError} />
}
