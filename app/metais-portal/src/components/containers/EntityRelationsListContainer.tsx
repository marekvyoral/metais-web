import React, { SetStateAction, useState } from 'react'

import { useEntityRelationsDataList, useEntityRelationsTypesCount } from '@/hooks/useEntityRelations'

interface IView {
    data: object
    setEnabled: React.Dispatch<SetStateAction<boolean>>
}

interface IEntityRelationsListContainer {
    entityId: string
    View: React.FC<IView>
    LoadingView: React.FC
    ErrorView: React.FC
}

export const EntityRelationsListContainer: React.FC<IEntityRelationsListContainer> = ({ entityId, View, LoadingView, ErrorView }) => {
    //gives list and numbers of entities of certain types f.e. Programs
    const { isLoading, isError, keysToDisplay, data: entityTypes } = useEntityRelationsTypesCount(entityId)

    //for loading onClick
    const [enabled, setEnabled] = useState(false)
    const {
        isLoading: isTypeRelationsDataListLoading,
        isError: isTypeRelationsDataListError,
        resultList: relationsList,
    } = useEntityRelationsDataList(keysToDisplay, entityId, enabled)

    if (isLoading || isTypeRelationsDataListLoading) {
        return <LoadingView />
    }

    if (isError || isTypeRelationsDataListError) {
        return <ErrorView />
    }

    return <View data={{ entityTypes, relationsList }} setEnabled={setEnabled} />
}
