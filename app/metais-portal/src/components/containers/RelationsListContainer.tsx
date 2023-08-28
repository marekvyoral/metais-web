import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { CiWithRelsResultUi, ReadCiNeighboursWithAllRelsParams, RelatedCiTypePreview, RoleParticipantUI } from '@isdd/metais-common/api'
import { IKeyToDisplay, useEntityRelationsDataList, useEntityRelationsTypesCount } from '@isdd/metais-common/hooks/useEntityRelations'
import React, { SetStateAction, useState } from 'react'

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
    setPageConfig: React.Dispatch<SetStateAction<ReadCiNeighboursWithAllRelsParams>>
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

    const defaultPageConfig: ReadCiNeighboursWithAllRelsParams = {
        ciTypes: keysToDisplay ? [keysToDisplay?.[0]?.technicalName] : undefined,
        page: 1,
        perPage: 10,
        state: ['DRAFT'],
    }

    const [pageConfig, setPageConfig] = useState<ReadCiNeighboursWithAllRelsParams>(defaultPageConfig)
    const handleFilterChange = (filter: IFilter) => {
        setPageConfig(mapFilterToNeighboursWithAllRelsApi(pageConfig, filter))
    }

    const { isLoading: areRelationsLoading, isError: areRelationsError, relationsList, owners } = useEntityRelationsDataList(entityId, pageConfig)

    const pagination: Pagination = {
        pageNumber: pageConfig.page ?? 1,
        pageSize: pageConfig.perPage ?? 10,
        dataLength: relationsList?.pagination?.totaltems ?? 0,
    }

    const isLoading = areRelationsLoading || areTypesLoading
    const isError = areTypesError || areRelationsError
    return (
        <View
            isLoading={isLoading}
            isError={isError}
            data={{
                entityTypes,
                relationsList,
                owners,
                keysToDisplay: keysToDisplay ?? [],
            }}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            setPageConfig={setPageConfig}
        />
    )
}
