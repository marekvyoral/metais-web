import React from 'react'

import { useEntityCiData } from '@/hooks/useEntityCiData'

interface IView {
    data: object
}

interface IEntityCiContainer {
    entityName: string
    entityId: string
    View: React.FC<IView>
    LoadingView: React.FC
    ErrorView: React.FC
}

export const EntityCiContainer: React.FC<IEntityCiContainer> = ({ entityId, entityName, View, LoadingView, ErrorView }) => {
    const { isLoading, isError, entityCiAttributes, entityCiData } = useEntityCiData(entityName, entityId)

    if (isLoading) {
        return <LoadingView />
    }

    if (isError) {
        return <ErrorView />
    }

    return <View data={{ entityCiData, entityCiAttributes }} />
}
