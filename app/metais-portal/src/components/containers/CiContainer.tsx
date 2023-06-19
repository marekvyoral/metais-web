import React from 'react'

import { ConfigurationItemUi, useReadConfigurationItemUsingGET } from '@/api'

export interface ICiContainerView {
    data: {
        ciItemData: ConfigurationItemUi | undefined
    }
}

interface ICiContainer {
    entityId: string
    View: React.FC<ICiContainerView>
}

export const CiContainer: React.FC<ICiContainer> = ({ entityId, View }) => {
    const { data: ciItemData, isLoading: isCiItemLoading, isError: isCiItemError } = useReadConfigurationItemUsingGET(entityId)

    if (isCiItemLoading) {
        return <div>Loading</div>
    }
    if (isCiItemError) {
        return <div>Error</div>
    }

    return <View data={{ ciItemData }} />
}
