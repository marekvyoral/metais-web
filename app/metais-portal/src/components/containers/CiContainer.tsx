import React from 'react'
import { ConfigurationItemUi, useReadConfigurationItemUsingGET } from '@isdd/metais-common/api'

export interface ICiContainerView {
    data?: ConfigurationItemUi
    isLoading: boolean
    isError: boolean
}
interface ICiContainer {
    configurationItemId?: string
    View: React.FC<ICiContainerView>
}

export const CiContainer: React.FC<ICiContainer> = ({ configurationItemId, View }) => {
    const { data: ciItemData, isLoading, isError } = useReadConfigurationItemUsingGET(configurationItemId ?? '')

    if (!configurationItemId) return <View isLoading={false} isError />
    return <View data={ciItemData} isLoading={isLoading} isError={isError} />
}
