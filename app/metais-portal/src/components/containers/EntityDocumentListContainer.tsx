import React, { SetStateAction, useState } from 'react'

import { useDocumentsListData } from '@/hooks/useEntityDocsListData'
import { IPageConfig } from '@/hooks/useEntityRelations'

interface IView {
    data: object
    setPageConfig: React.Dispatch<SetStateAction<IPageConfig>>
}

interface IEntityDocumentsListContainer {
    entityId: string
    View: React.FC<IView>
    LoadingView: React.FC
    ErrorView: React.FC
}

export const EntityDocumentsListContainer: React.FC<IEntityDocumentsListContainer> = ({ entityId, View, LoadingView, ErrorView }) => {
    const defaultPageConfig: IPageConfig = {
        page: 1,
        perPage: 100,
    }

    const [pageConfig, setPageConfig] = useState<IPageConfig>(defaultPageConfig)
    const { isLoading, isError, data: documentCiData, resultList: documentsList } = useDocumentsListData(entityId, pageConfig)

    if (isLoading) {
        return <LoadingView />
    }

    if (isError) {
        return <ErrorView />
    }

    return <View data={{ documentCiData, documentsList }} setPageConfig={setPageConfig} />
}
