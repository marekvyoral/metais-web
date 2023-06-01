import React from 'react'

import { useEntityCiData } from '@/hooks/useEntityCiData'
import { useEntityCiAttributes } from '@/hooks/useEntityCiAttributes'

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
    const { isLoading: isEntityDataLoading, isError: isEntityDataError, entityCiData } = useEntityCiData(entityName)
    const { isLoading: isAttributesLoading, isError: isAttributesError, data: entityCiAttributes } = useEntityCiAttributes(entityId)

    const isLoading = [isEntityDataLoading, isAttributesLoading].some((item) => item)
    const isError = [isEntityDataError, isAttributesError].some((item) => item)

    if (isLoading) {
        return <LoadingView />
    }

    if (isError) {
        return <ErrorView />
    }

    return <View data={{ entityCiData, entityCiAttributes }} />
}
