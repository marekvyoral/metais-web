import React, { SetStateAction, useState } from 'react'

import { IPageConfig } from '@/hooks/useEntityRelations'
import { NeighbourSetUi, NeighboursFilterContainerUi, useReadCiNeighboursUsingPOST } from '@/api'

interface IView {
    data?: NeighbourSetUi
    setPageConfig: React.Dispatch<SetStateAction<IPageConfig>>
    isLoading: boolean
    isError: boolean
}

interface IRelationshipsTableContainer {
    configurationItemId?: string
    View: React.FC<IView>
    defaultFilter: NeighboursFilterContainerUi
}

export const RelationshipsTableContainer: React.FC<IRelationshipsTableContainer> = ({ configurationItemId, View, defaultFilter }) => {
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
