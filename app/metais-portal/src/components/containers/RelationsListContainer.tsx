import React, { SetStateAction, useState } from 'react'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'

import { IKeyToDisplay, useEntityRelationsDataList, useEntityRelationsTypesCount } from '@/hooks/useEntityRelations'
import { CiWithRelsResultUi, ReadCiNeighboursWithAllRelsUsingGETParams, RelatedCiTypePreview, RoleParticipantUI } from '@/api'
import { mapFilterToNeighboursWithAllRelsApi } from '@/componentHelpers'

export interface IRelationsView {
    isLoading: boolean
    isError: boolean
    data: {
        entityTypes?: RelatedCiTypePreview[]
        relationsList?: CiWithRelsResultUi
        owners?: void | RoleParticipantUI[] | undefined
        keysToDisplay: IKeyToDisplay[]
    }
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    setPageConfig: React.Dispatch<SetStateAction<ReadCiNeighboursWithAllRelsUsingGETParams>>
}

interface IRelationsListContainer {
    entityId: string
    technicalName: string
    View: React.FC<IRelationsView>
}

export const RelationsListContainer: React.FC<IRelationsListContainer> = ({ entityId, technicalName, View }) => {
    const {
        isLoading: areTypesLoading,
        isError: areTypesError,
        keysToDisplay,
        data: entityTypes,
    } = useEntityRelationsTypesCount(entityId, technicalName)
    const defaultPageConfig: ReadCiNeighboursWithAllRelsUsingGETParams = {
        ciTypes: [keysToDisplay[0].technicalName],
        page: 1,
        perPage: 10,
        state: ['DRAFT'],
    }

    const [pageConfig, setPageConfig] = useState<ReadCiNeighboursWithAllRelsUsingGETParams>(defaultPageConfig)
    const handleFilterChange = (filter: IFilter) => {
        setPageConfig(mapFilterToNeighboursWithAllRelsApi(pageConfig, filter))
    }
    const { isLoading: areRelationsLoading, isError: areRelationsError, relationsList, owners } = useEntityRelationsDataList(entityId, pageConfig)

    if (areTypesLoading) {
        return <div>Loading...</div>
    }
    if (areTypesError) {
        return <div>Error</div>
    }

    const pagination: Pagination = {
        pageNumber: pageConfig.page ?? 1,
        pageSize: pageConfig.perPage ?? 10,
        dataLength: relationsList?.pagination?.totaltems ?? 0,
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
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            setPageConfig={setPageConfig}
        />
    )
}
