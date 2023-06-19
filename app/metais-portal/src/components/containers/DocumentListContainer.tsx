import React, { SetStateAction, useState } from 'react'

import { IPageConfig } from '@/hooks/useEntityRelations'
import { NeighboursFilterContainerUi, useReadCiNeighboursUsingPOST, NeighbourPairUi } from '@/api'

export interface IView {
    data?: NeighbourPairUi[]
    setPageConfig: React.Dispatch<SetStateAction<IPageConfig>>
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
    const [pageConfig, setPageConfig] = useState<IPageConfig>(defaultPageConfig)

    const defaultFilter: NeighboursFilterContainerUi = {
        neighboursFilter: {
            ciType: ['Dokument'],
            metaAttributes: { state: ['DRAFT'] },
            relType: ['CI_HAS_DOCUMENT', 'Dokument_sa_tyka_KRIS', 'CONTROL_HAS_DOCUMENT', 'PROJECT_HAS_DOCUMENT'],
            usageType: ['system', 'application'],
        },
        ...pageConfig,
    }

    const { isLoading, isError, data: documentCiData } = useReadCiNeighboursUsingPOST(configurationItemId ?? '', defaultFilter, {})
    if (!configurationItemId) return <View setPageConfig={setPageConfig} isLoading={false} isError />

    return (
        <View data={documentCiData?.fromNodes?.neighbourPairs ?? undefined} setPageConfig={setPageConfig} isLoading={isLoading} isError={isError} />
    )
}
