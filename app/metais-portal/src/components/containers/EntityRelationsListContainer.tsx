import React, { SetStateAction, useState } from 'react'

import { IPageConfig, useEntityRelationsDataList, useEntityRelationsTypesCount } from '@/hooks/useEntityRelations'

export interface IRelationsView {
    entityTypes: any
    relationsList: any
    keysToDisplay: string[]
    setClickedEntityName: React.Dispatch<SetStateAction<string>>
    setPageConfig: React.Dispatch<SetStateAction<IPageConfig>>
}

interface IEntityRelationsListContainer {
    entityId: string
    View: React.FC<IRelationsView>
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
    const [clickedEntityName, setClickedEntityName] = useState<string>('')

    const {
        isLoading: isTypeRelationsDataListLoading,
        isError: isTypeRelationsDataListError,
        resultList: relationsList,
    } = useEntityRelationsDataList(keysToDisplay, entityId, pageConfig, clickedEntityName)

    return (
        <View
            entityTypes={entityTypes}
            relationsList={relationsList}
            keysToDisplay={keysToDisplay}
            setPageConfig={setPageConfig}
            setClickedEntityName={setClickedEntityName}
        />
    )
}
