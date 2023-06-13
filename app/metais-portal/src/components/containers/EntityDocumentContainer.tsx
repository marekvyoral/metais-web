import React, { SetStateAction, useState } from 'react'

import { IPageConfig } from '@/hooks/useEntityRelations'
import { NeighboursFilterContainerUi, useReadCiNeighboursUsingPOST } from '@/api'
import {
    ConfigurationItemMapped,
    NeighbourPairsEntity,
    ReadCiNeighboursUsingPOST200_GeneratedType,
} from '@/api/types/ReadCiNeighboursUsingPOST200_GeneratedType'

interface IView {
    data?: ConfigurationItemMapped[]
    setPageConfig: React.Dispatch<SetStateAction<IPageConfig>>
    isLoading: boolean
    isError: boolean
}

interface IEntityDocumentsContainer {
    configurationItemId?: string
    View: React.FC<IView>
}

export const EntityDocumentsContainer: React.FC<IEntityDocumentsContainer> = ({ configurationItemId, View }) => {
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

    if (!configurationItemId) return <View setPageConfig={setPageConfig} isLoading={false} isError={true} />

    const { isLoading, isError, data: documentCiData } = useReadCiNeighboursUsingPOST(configurationItemId, defaultFilter, {})
    const data = mapCiDataFrom(documentCiData as ReadCiNeighboursUsingPOST200_GeneratedType)

    return <View data={data} setPageConfig={setPageConfig} isLoading={isLoading} isError={isError} />
}

export const mapCiDataFrom = (documentCiData: ReadCiNeighboursUsingPOST200_GeneratedType | void): ConfigurationItemMapped[] | undefined => {
    return documentCiData?.fromNodes?.neighbourPairs?.map((nP: NeighbourPairsEntity) => {
        //todo check this after orval keyValue changes
        const keyValue = new Map<string, string>()
        nP?.configurationItem?.attributes?.forEach((attribute: { name: string; value: string }) => {
            keyValue.set(attribute?.name, attribute?.value)
        })
        const attributes = Object.fromEntries(keyValue)

        return { attributes, ...nP?.configurationItem }
    })
}

export const mapCiDataTo = (documentCiData: ReadCiNeighboursUsingPOST200_GeneratedType | void): ConfigurationItemMapped[] | undefined => {
    return documentCiData?.toNodes?.neighbourPairs?.map((nP: NeighbourPairsEntity) => {
        //todo check this after orval keyValue changes
        const keyValue = new Map<string, string>()
        nP?.configurationItem?.attributes?.forEach((attribute: { name: string; value: string }) => {
            keyValue.set(attribute?.name, attribute?.value)
        })
        const attributes = Object.fromEntries(keyValue)

        return { attributes, ...nP?.configurationItem }
    })
}
