import React, { SetStateAction, useState } from 'react'

import { IPageConfig, useEntityRelationsDataList, useEntityRelationsTypesCount } from '@/hooks/useEntityRelations'
import { CiWithRelsResultUi, RelatedCiTypePreview } from '@/api'

export interface IRelationsView {
    data: {
        entityTypes: RelatedCiTypePreview[] | undefined
        relationsList: CiWithRelsResultUi | undefined
        keysToDisplay: {
            tabName: string
            technicalName: string
        }[]
    }
    filterCallback: {
        setPageConfig: React.Dispatch<SetStateAction<IPageConfig>>
    }
    setClickedEntityName: React.Dispatch<SetStateAction<string>>
}

interface IRelationsListContainer {
    entityId: string
    technicalName: string
    View: React.FC<IRelationsView>
}

export const RelationsListContainer: React.FC<IRelationsListContainer> = ({ entityId, technicalName, View }) => {
    const { keysToDisplay, data: entityTypes } = useEntityRelationsTypesCount(entityId, technicalName)

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
