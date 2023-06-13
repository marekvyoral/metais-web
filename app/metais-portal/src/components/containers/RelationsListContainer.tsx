import React, { SetStateAction, useState } from 'react'

import { IPageConfig, useEntityRelationsDataList, useEntityRelationsTypesCount } from '@/hooks/useEntityRelations'
import { ReadCiNeighboursWithAllRelsUsingGET200, ReadNeighboursConfigurationItemsCountUsingGET200 } from '@/api/generated/cmdb-swagger'

export interface IRelationsView {
    data: {
        entityTypes: ReadNeighboursConfigurationItemsCountUsingGET200 | undefined
        relationsList: ReadCiNeighboursWithAllRelsUsingGET200 | undefined
        keysToDisplay: string[]
    }
    filterCallback: {
        setPageConfig: React.Dispatch<SetStateAction<IPageConfig>>
    }
    setClickedEntityName: React.Dispatch<SetStateAction<string>>
}

interface IRelationsListContainer {
    entityId: string
    View: React.FC<IRelationsView>
}

export const RelationsListContainer: React.FC<IRelationsListContainer> = ({ entityId, View }) => {
    const { keysToDisplay, data: entityTypes } = useEntityRelationsTypesCount(entityId)

    const defaultPageConfig: IPageConfig = {
        page: 1,
        perPage: 5,
    }

    const [pageConfig, setPageConfig] = useState<IPageConfig>(defaultPageConfig)
    const [clickedEntityName, setClickedEntityName] = useState<string>('')

    const { data: relationsList } = useEntityRelationsDataList(entityId, pageConfig, clickedEntityName)

    return (
        <View
            data={{
                entityTypes,
                relationsList,
                keysToDisplay,
            }}
            filterCallback={{ setPageConfig }}
            setClickedEntityName={setClickedEntityName}
        />
    )
}
