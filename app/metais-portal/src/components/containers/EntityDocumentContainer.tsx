import React, { SetStateAction, useState } from 'react'

import { IPageConfig } from '@/hooks/useEntityRelations'
import { useReadCiNeighboursUsingPOST } from '@/api'

interface IView {
    data: object
    setPageConfig: React.Dispatch<SetStateAction<IPageConfig>>
}

interface IEntityDocumentsContainer {
    entityId: string
    View: React.FC<IView>
    LoadingView: React.FC
    ErrorView: React.FC
}

export const EntityDocumentsContainer: React.FC<IEntityDocumentsContainer> = ({ entityId, View, LoadingView, ErrorView }) => {
    const defaultPageConfig: IPageConfig = {
        page: 1,
        perPage: 100,
    }

    const [pageConfig, setPageConfig] = useState<IPageConfig>(defaultPageConfig)

    const { isLoading, isError, data: documentCiData } = useReadCiNeighboursUsingPOST(entityId, pageConfig, {})
    debugger

    //const { isLoading, isError, data: documentCiData, resultList: documentsList } = useDocumentsListData(entityId, pageConfig)

    if (isLoading) {
        return <LoadingView />
    }

    if (isError) {
        return <ErrorView />
    }

    return <View data={{ documentCiData }} setPageConfig={setPageConfig} />
}
