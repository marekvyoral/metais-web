import React, { SetStateAction, useState } from 'react'

import { IPageConfig, useEntityRelationsDataList, useEntityRelationsTypesCount } from '@/hooks/useEntityRelations'

interface IView {
    data: object
    setEnabled: React.Dispatch<SetStateAction<boolean>>
    setPageConfig: React.Dispatch<SetStateAction<IPageConfig>>
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

    const defaultPageConfig: IPageConfig = {
        page: 1,
        perPage: 5,
    }

    const [pageConfig, setPageConfig] = useState<IPageConfig>(defaultPageConfig)
    const [enabled, setEnabled] = useState(true)

    const {
        isLoading: isTypeRelationsDataListLoading,
        isError: isTypeRelationsDataListError,
        resultList: relationsList,
    } = useEntityRelationsDataList(keysToDisplay, entityId, enabled, pageConfig)

    if (isLoading || isTypeRelationsDataListLoading) {
        return <LoadingView />
    }

    if (isError || isTypeRelationsDataListError) {
        return <ErrorView />
    }

    return <View data={{ entityTypes, relationsList }} setEnabled={setEnabled} setPageConfig={setPageConfig} />
}
