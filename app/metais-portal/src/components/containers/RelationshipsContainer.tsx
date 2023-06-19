import React from 'react'

import { ConfigurationItemUi, useReadConfigurationItemUsingGET } from '@/api'

interface IView {
    data?: ConfigurationItemUi
    isLoading: boolean
    isError: boolean
}
interface IRelationshipsContainer {
    configurationItemId?: string
    View: React.FC<IView>
}

export const RelationshipsAccordionContainer: React.FC<IRelationshipsContainer> = ({ configurationItemId, View }) => {
    const { isLoading, isError, data: documentCiData } = useReadConfigurationItemUsingGET(configurationItemId ?? '')
    if (!configurationItemId) return <View isLoading={false} isError />
    return <View data={documentCiData} isLoading={isLoading} isError={isError} />
}
