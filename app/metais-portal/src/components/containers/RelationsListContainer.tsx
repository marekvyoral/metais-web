import { IFilter, Pagination, SortType } from '@isdd/idsk-ui-kit/types'
import { ReadCiNeighboursWithAllRelsParams, RoleParticipantUI } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useEntityRelationsDataList } from '@isdd/metais-common/hooks/useEntityRelationsDataList'
import { IKeyToDisplay, useEntityRelationsTypesCount } from '@isdd/metais-common/hooks/useEntityRelationsTypesCount'
import React, { SetStateAction, useEffect, useMemo, useState } from 'react'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, RELATIONSHIP_TYPES_QUERY_KEY } from '@isdd/metais-common/constants'
import { mapFilterToNeighboursWithAllRelsApi } from '@isdd/metais-common/componentHelpers'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { RelationshipTypePreview, useListRelationshipTypes } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useGetCiTypeWrapper } from '@isdd/metais-common/hooks/useCiType.hook'
import { useTranslation } from 'react-i18next'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'

import { NeighboursCardList } from '@/components/entities/NeighboursCardList'
import { getRelationsSorter } from '@/componentHelpers/ci/ciRelationsSortConfig'

export interface IRelationsView {
    isLoading: boolean
    isError: boolean
    data: {
        owners?: void | RoleParticipantUI[] | undefined
        keysToDisplay: IKeyToDisplay[]
        relationTypes: RelationshipTypePreview[]
    }
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    setPageConfig: React.Dispatch<SetStateAction<ReadCiNeighboursWithAllRelsParams>>
}

interface IRelationsListContainer {
    entityId: string
    technicalName: string
    showOnlyTabsWithRelations?: boolean
    hideButtons?: boolean
    hidePageSizeSelect?: boolean
    includeDeleted?: boolean
    tabsToShowRelAttributes?: string[]
}

export const RelationsListContainer: React.FC<IRelationsListContainer> = ({
    entityId,
    technicalName,
    showOnlyTabsWithRelations = false,
    hideButtons = false,
    hidePageSizeSelect = false,
    includeDeleted = false,
    tabsToShowRelAttributes = [],
}) => {
    const { i18n } = useTranslation()
    const { data: ciTypeData } = useGetCiTypeWrapper(technicalName)
    const {
        isLoading: areTypesLoading,
        isError: areTypesError,
        keysToDisplay: keysToDisplayUnsorted,
    } = useEntityRelationsTypesCount(entityId, technicalName, includeDeleted)

    const keysToDisplay = useMemo(() => keysToDisplayUnsorted.sort(getRelationsSorter(technicalName)), [keysToDisplayUnsorted, technicalName])

    const { data: relationTypes } = useListRelationshipTypes({ filter: {} }, { query: { queryKey: [RELATIONSHIP_TYPES_QUERY_KEY, i18n.language] } })

    const { currentPreferences } = useUserPreferences()

    const defaultCiType = keysToDisplay?.[0]?.technicalName
    const defaultIsDerived = keysToDisplay?.[0]?.isDerived
    const defaultCiTypes: string[] = useMemo((): string[] => {
        return defaultCiType ? [defaultCiType] : []
    }, [defaultCiType])

    const defaultPageConfig: ReadCiNeighboursWithAllRelsParams = useMemo(() => {
        const invalidatedParams = includeDeleted ? ['DRAFT', 'INVALIDATED', 'DELETED'] : ['DRAFT', 'INVALIDATED']
        const state = currentPreferences.showInvalidatedItems ? invalidatedParams : ['DRAFT']
        if (!defaultIsDerived) {
            return {
                ciTypes: defaultCiTypes,
                page: BASE_PAGE_NUMBER,
                perPage: BASE_PAGE_SIZE,
                sortBy: ATTRIBUTE_NAME.Gen_Profil_nazov,
                sortType: SortType.ASC,
                state,
            }
        } else {
            return {
                relTypes: defaultCiTypes,
                page: BASE_PAGE_NUMBER,
                perPage: BASE_PAGE_SIZE,
                sortBy: ATTRIBUTE_NAME.Gen_Profil_nazov,
                sortType: SortType.ASC,
                state,
            }
        }
    }, [currentPreferences.showInvalidatedItems, defaultCiTypes, defaultIsDerived, includeDeleted])

    const [pageConfig, setPageConfig] = useState<ReadCiNeighboursWithAllRelsParams>(defaultPageConfig)
    const [isDerived, setIsDerived] = useState<boolean>(false)

    useEffect(() => {
        if (defaultCiType) {
            setIsDerived(defaultIsDerived)
            setPageConfig(defaultPageConfig)
        }
    }, [defaultCiType, defaultIsDerived, defaultPageConfig])

    const handleFilterChange = (filter: IFilter) => {
        setPageConfig(mapFilterToNeighboursWithAllRelsApi(pageConfig, filter))
    }

    const {
        isLoading: areRelationsLoading,
        isDerivedLoading: areDerivedLoading,
        isError: areRelationsError,
        relationsList,
        owners,
    } = useEntityRelationsDataList(entityId, pageConfig, isDerived)

    const pagination: Pagination = {
        pageNumber: pageConfig.page ?? 1,
        pageSize: pageConfig.perPage ?? 10,
        dataLength: relationsList?.pagination?.totaltems ?? 0,
    }

    const isError = areTypesError || areRelationsError

    const keysToDisplayOnlyWithRelations = keysToDisplay?.filter?.((item) => item.count)

    return (
        <NeighboursCardList
            tabsToShowRelAttributes={tabsToShowRelAttributes}
            areTypesLoading={areTypesLoading}
            isLoading={areRelationsLoading}
            isDerivedLoading={areDerivedLoading}
            isError={isError}
            relationsList={{ ...relationsList }}
            data={{
                owners,
                keysToDisplay: showOnlyTabsWithRelations ? keysToDisplayOnlyWithRelations : keysToDisplay ?? [],
                relationTypes: relationTypes?.results ?? [],
            }}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            setPageConfig={setPageConfig}
            setIsDerived={setIsDerived}
            ciTypeData={ciTypeData}
            hideButtons={hideButtons}
            hidePageSizeSelect={hidePageSizeSelect}
        />
    )
}
