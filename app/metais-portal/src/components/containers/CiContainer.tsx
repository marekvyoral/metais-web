import React from 'react'

import { ConfigurationItemUi, useReadConfigurationItem } from '@/api'

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
    const { data: ciItemData, isLoading, isError } = useReadConfigurationItem(configurationItemId ?? '')

    if (!configurationItemId) return <View isLoading={false} isError />
    return <View data={ciItemData} isLoading={isLoading} isError={isError} />
}
