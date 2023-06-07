import React, { SetStateAction, useState } from 'react'

import { IPageConfig, useEntityRelationsDataList, useEntityRelationsTypesCount } from '@/hooks/useEntityRelations'
import { ReadCiNeighboursWithAllRelsUsingGET200, ReadNeighboursConfigurationItemsCountUsingGET200 } from '@/api/generated/cmdb-swagger'

export interface IRelationsView {
    entityTypes: ReadNeighboursConfigurationItemsCountUsingGET200 | undefined
    relationsList: ReadCiNeighboursWithAllRelsUsingGET200 | undefined
    keysToDisplay: string[]
    setClickedEntityName: React.Dispatch<SetStateAction<string>>
    setPageConfig: React.Dispatch<SetStateAction<IPageConfig>>
}

interface IEntityRelationsListContainer {
    entityId: string
    View: React.FC<IRelationsView>
}

export const EntityRelationsListContainer: React.FC<IEntityRelationsListContainer> = ({ entityId, View }) => {
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
        data: relationsList,
    } = useEntityRelationsDataList(entityId, pageConfig, clickedEntityName)

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
