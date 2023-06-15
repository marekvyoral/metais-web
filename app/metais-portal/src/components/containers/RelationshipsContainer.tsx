import React from 'react'

import { useReadConfigurationItemUsingGET } from '@/api'
import { ConfigurationItem, ConfigurationItemMapped } from '@/api/types/ReadCiNeighboursUsingPOST200_GeneratedType'
import { mapCiData } from '@/componentHelpers'

interface IView {
    data?: ConfigurationItemMapped
    isLoading: boolean
    isError: boolean
}
interface IRelationshipsContainer {
    configurationItemId?: string
    View: React.FC<IView>
}

export const RelationshipsAccordionContainer: React.FC<IRelationshipsContainer> = ({ configurationItemId, View }) => {
    const { isLoading, isError, data: documentCiData } = useReadConfigurationItemUsingGET(configurationItemId ?? '', {}, {})
    if (!configurationItemId) return <View isLoading={false} isError />
    const data = mapCiData(documentCiData as ConfigurationItem)

    return <View data={data} isLoading={isLoading} isError={isError} />
}
