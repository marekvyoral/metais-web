import React, { SetStateAction, useState } from 'react'

import { IKeyToDisplay, IPageConfig, useEntityRelationsDataList, useEntityRelationsTypesCount } from '@/hooks/useEntityRelations'
import { CiWithRelsResultUi, RelatedCiTypePreview, RoleParticipantUI } from '@/api'

export interface IRelationsView {
    isLoading: boolean
    isError: boolean
    data: {
        entityTypes?: RelatedCiTypePreview[]
        relationsList?: CiWithRelsResultUi
        owners?: void | RoleParticipantUI[] | undefined
        keysToDisplay: IKeyToDisplay[]
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
    const defaultPageConfig: IPageConfig = {
        page: 1,
        perPage: 5,
    }

    const [pageConfig, setPageConfig] = useState<IPageConfig>(defaultPageConfig)
    const {
        isLoading: areTypesLoading,
        isError: areTypesError,
        keysToDisplay,
        data: entityTypes,
    } = useEntityRelationsTypesCount(entityId, technicalName)
    const [clickedEntityName, setClickedEntityName] = useState<string>(keysToDisplay[0].technicalName)
    const {
        isLoading: areRelationsLoading,
        isError: areRelationsError,
        relationsList,
        owners,
    } = useEntityRelationsDataList(entityId, pageConfig, clickedEntityName)

    if (areTypesLoading) {
        return <div>Loading...</div>
    }
    if (areTypesError) {
        return <div>Error</div>
    }

    return (
        <View
            isLoading={areRelationsLoading}
            isError={areRelationsError}
            data={{
                entityTypes,
                relationsList,
                owners,
                keysToDisplay,
            }}
            filterCallback={{ setPageConfig }}
            setClickedEntityName={setClickedEntityName}
        />
    )
}
