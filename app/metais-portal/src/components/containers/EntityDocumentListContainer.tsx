import React from 'react'

interface IView {
    data: object
}

interface IEntityDocumentsListContainer {
    entityId: string
    View: React.FC<IView>
    LoadingView: React.FC
    ErrorView: React.FC
}

export const EntityDocumentsListContainer: React.FC<IEntityDocumentsListContainer> = ({ entityId, View, LoadingView, ErrorView }) => {
    const { isLoading, isError, data: documentCiData, resultList: documentsList } = useDocumentsListData(entityId)

    if (isLoading) {
        return <LoadingView />
    }

    if (isError) {
        return <ErrorView />
    }

    return <View data={{ documentCiData, documentsList }} />
}
