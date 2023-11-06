import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ReadCiNeighboursWithAllRelsParams, RoleParticipantUI } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useEntityRelationsDataList } from '@isdd/metais-common/hooks/useEntityRelationsDataList'
import { IKeyToDisplay, useEntityRelationsTypesCount } from '@isdd/metais-common/hooks/useEntityRelationsTypesCount'
import React, { SetStateAction, useEffect, useMemo, useState } from 'react'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { mapFilterToNeighboursWithAllRelsApi } from '@isdd/metais-common/componentHelpers'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { RelationshipTypePreview, useGetCiType, useListRelationshipTypes } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { NeighboursCardList } from '@/components/entities/NeighboursCardList'

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
}

export const RelationsListContainer: React.FC<IRelationsListContainer> = ({ entityId, technicalName }) => {
    const { data: ciTypeData } = useGetCiType(technicalName)
    const { isLoading: areTypesLoading, isError: areTypesError, keysToDisplay } = useEntityRelationsTypesCount(entityId, technicalName)

    const { data: relationTypes } = useListRelationshipTypes({ filter: { role: undefined } })

    const { currentPreferences } = useUserPreferences()

    const defaultCiType = keysToDisplay?.[0]?.technicalName
    const defaultIsDerived = keysToDisplay?.[0]?.isDerived
    const defaultCiTypes: string[] = useMemo((): string[] => {
        return defaultCiType ? [defaultCiType] : []
    }, [defaultCiType])

    const defaultPageConfig: ReadCiNeighboursWithAllRelsParams = useMemo(() => {
        const state = currentPreferences.showInvalidatedItems ? ['DRAFT', 'INVALIDATED'] : ['DRAFT']
        if (!defaultIsDerived) {
            return {
                ciTypes: defaultCiTypes,
                page: BASE_PAGE_NUMBER,
                perPage: BASE_PAGE_SIZE,
                state,
            }
        } else {
            return {
                relTypes: defaultCiTypes,
                page: BASE_PAGE_NUMBER,
                perPage: BASE_PAGE_SIZE,
                state,
            }
        }
    }, [currentPreferences.showInvalidatedItems, defaultCiTypes, defaultIsDerived])

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

    return (
        <NeighboursCardList
            areTypesLoading={areTypesLoading}
            isLoading={areRelationsLoading}
            isDerivedLoading={areDerivedLoading}
            isError={isError}
            relationsList={{ ...relationsList }}
            data={{
                owners,
                keysToDisplay: keysToDisplay ?? [],
                relationTypes: relationTypes?.results ?? [],
            }}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            setPageConfig={setPageConfig}
            setIsDerived={setIsDerived}
            ciTypeData={ciTypeData}
        />
    )
}
