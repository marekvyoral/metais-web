import React, { SetStateAction, useState } from 'react'

import { useReadConfigurationItemUsingGET } from '@/api'
import { AttributeValue, AttributesEntity, ConfigurationItem, ConfigurationItemMapped } from '@/api/types/ReadCiNeighboursUsingPOST200_GeneratedType'
import { IPageConfig } from '@/hooks/useEntityRelations'

const mapCiData = (documentCiData: ConfigurationItem | void) => {
    const keyValue = new Map<string, AttributeValue>()

    documentCiData?.attributes?.forEach((attribute: AttributesEntity) => {
        keyValue.set(attribute?.name, attribute?.value)
    })
    const attributes = Object.fromEntries(keyValue)
    return { ...documentCiData, attributes } as ConfigurationItemMapped
}

interface IView {
    data?: ConfigurationItemMapped
    setPageConfig: React.Dispatch<SetStateAction<IPageConfig>>
    isLoading: boolean
    isError: boolean
}
interface IRelationshipsContainer {
    configurationItemId?: string
    View: React.FC<IView>
}

export const RelationshipsContainer: React.FC<IRelationshipsContainer> = ({ configurationItemId, View }) => {
    const defaultPageConfig: IPageConfig = {
        page: 1,
        perPage: 100,
    }
    const [pageConfig, setPageConfig] = useState<IPageConfig>(defaultPageConfig)

    const { isLoading, isError, data: documentCiData } = useReadConfigurationItemUsingGET(configurationItemId ?? '', {}, {})
    if (!configurationItemId) return <View setPageConfig={setPageConfig} isLoading={false} isError />

    const data = mapCiData(documentCiData as ConfigurationItem)

    return <View data={data} setPageConfig={setPageConfig} isLoading={isLoading} isError={isError} />
}
