import React, { SetStateAction, useState } from 'react'

import { IPageConfig } from '@/hooks/useEntityRelations'
import { NeighboursFilterContainerUi, useReadCiNeighboursUsingPOST } from '@/api'
import { ReadCiNeighboursUsingPOST200_GeneratedType, NeighbourPairsEntityMapped } from '@/api/types/ReadCiNeighboursUsingPOST200_GeneratedType'

interface IView {
    data?: NeighbourPairsEntityMapped[]
    setPageConfig: React.Dispatch<SetStateAction<IPageConfig>>
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
    const [pageConfig, setPageConfig] = useState<IPageConfig>(defaultPageConfig)

    const preSetFilter: NeighboursFilterContainerUi = {
        ...defaultFilter,
        ...pageConfig,
    }

    const { isLoading, isError, data: documentCiData } = useReadCiNeighboursUsingPOST(configurationItemId ?? '', preSetFilter, {})

    if (!configurationItemId) return <View setPageConfig={setPageConfig} isLoading={false} isError />

    const data = mapData(documentCiData as ReadCiNeighboursUsingPOST200_GeneratedType)

    return <View data={data} setPageConfig={setPageConfig} isLoading={isLoading} isError={isError} />
}
