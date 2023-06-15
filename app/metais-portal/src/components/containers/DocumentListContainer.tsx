import React, { SetStateAction, useState } from 'react'

import { IPageConfig } from '@/hooks/useEntityRelations'
import { NeighboursFilterContainerUi, useReadCiNeighboursUsingPOST } from '@/api'
import {
    NeighbourPairsEntity,
    ReadCiNeighboursUsingPOST200_GeneratedType,
    AttributesEntity,
    AttributeValue,
    NeighbourPairsEntityMapped,
} from '@/api/types/ReadCiNeighboursUsingPOST200_GeneratedType'

export interface IView {
    data?: NeighbourPairsEntityMapped[]
    setPageConfig: React.Dispatch<SetStateAction<IPageConfig>>
    isLoading: boolean
    isError: boolean
}

interface IDocumentsListContainer {
    configurationItemId?: string
    View: React.FC<IView>
}

export const mapCiDataFrom = (documentCiData: ReadCiNeighboursUsingPOST200_GeneratedType | void): NeighbourPairsEntityMapped[] | undefined => {
    return documentCiData?.fromNodes?.neighbourPairs?.map((nP: NeighbourPairsEntity) => {
        //this should be changed after orval keyValue changes
        const keyValue = new Map<string, AttributeValue>()
        nP?.configurationItem?.attributes?.forEach((attribute: AttributesEntity) => {
            keyValue.set(attribute?.name, attribute?.value)
        })
        const attributes = Object.fromEntries(keyValue)

        return { ...nP, configurationItem: { ...nP?.configurationItem, attributes } } as NeighbourPairsEntityMapped
    })
}

export const mapCiDataTo = (documentCiData: ReadCiNeighboursUsingPOST200_GeneratedType | void): NeighbourPairsEntityMapped[] | undefined => {
    return documentCiData?.toNodes?.neighbourPairs?.map((nP: NeighbourPairsEntity) => {
        //this should be changed after orval keyValue changes
        const keyValue = new Map<string, AttributeValue>()
        nP?.configurationItem?.attributes?.forEach((attribute: AttributesEntity) => {
            keyValue.set(attribute?.name, attribute?.value)
        })
        const attributes = Object.fromEntries(keyValue)

        return { ...nP, configurationItem: { ...nP?.configurationItem, attributes } } as NeighbourPairsEntityMapped
    })
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

    const data = mapCiDataFrom(documentCiData as ReadCiNeighboursUsingPOST200_GeneratedType)

    return <View data={data} setPageConfig={setPageConfig} isLoading={isLoading} isError={isError} />
}
