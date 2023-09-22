import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { CiWithRelsResultUi, ReadCiNeighboursWithAllRelsParams, RelatedCiTypePreview, RoleParticipantUI } from '@isdd/metais-common/api'
import { useEntityRelationsDataList } from '@isdd/metais-common/hooks/useEntityRelationsDataList'
import { IKeyToDisplay, useEntityRelationsTypesCount } from '@isdd/metais-common/hooks/useEntityRelationsTypesCount'
import React, { SetStateAction, useEffect, useMemo, useState } from 'react'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { mapFilterToNeighboursWithAllRelsApi } from '@isdd/metais-common/componentHelpers'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'

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
    const { currentPreferences } = useUserPreferences()
    const defaultCiType = keysToDisplay?.[0]?.technicalName
    const defaultCiTypes: string[] = useMemo((): string[] => {
        return defaultCiType ? [defaultCiType] : []
    }, [defaultCiType])

    const defaultPageConfig: ReadCiNeighboursWithAllRelsParams = useMemo(() => {
        const state = currentPreferences.showInvalidatedItems ? ['DRAFT', 'INVALIDATED'] : ['DRAFT']
        return {
            ciTypes: defaultCiTypes,
            page: BASE_PAGE_NUMBER,
            perPage: BASE_PAGE_SIZE,
            state,
        }
    }, [currentPreferences.showInvalidatedItems, defaultCiTypes])

    const [pageConfig, setPageConfig] = useState<ReadCiNeighboursWithAllRelsParams>(defaultPageConfig)

    useEffect(() => {
        if (defaultCiType) {
            setPageConfig(defaultPageConfig)
        }
    }, [defaultCiType, defaultPageConfig])

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
