import { IColumn } from '@isdd/idsk-ui-kit/index'
import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import {
    CiListFilterContainerUi,
    ConfigurationItemSetUi,
    RoleParticipantUI,
    useGetRoleParticipantBulk,
    useReadCiList1,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Attribute, AttributeProfile, CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { FavoriteCiType } from '@isdd/metais-common/api/generated/user-config-swagger'
import { useFilterForCiList, useGetColumnData, usePagination } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { mapFilterParamsToApi } from '@isdd/metais-common/componentHelpers/filter'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { QueryObserverResult } from '@tanstack/react-query'
import React from 'react'
import { FieldValues } from 'react-hook-form'

export interface ICiListContainerView<T> {
    entityStructure?: CiType
    columnListData: IColumn | undefined
    unitsData?: EnumType
    constraintsData?: (EnumType | undefined)[]
    ciData?: ConfigurationItemSetUi
    ciTypeData: CiType | undefined
    tableData: ConfigurationItemSetUi | undefined
    attributeProfiles?: AttributeProfile[]
    attributes?: Attribute[]
    gestorsData?: RoleParticipantUI[]
    entityName: string
    defaultFilterValues: T
    handleFilterChange: (filter: IFilter) => void
    storeUserSelectedColumns: (columnSelection: FavoriteCiType) => void
    resetUserSelectedColumns: () => Promise<void>
    refetch: () => Promise<QueryObserverResult>
    pagination: Pagination
    sort: ColumnSort[]
    isError: boolean
    isLoading: boolean
    POType: string
}

interface ICiListContainer<T> {
    entityName: string
    POType?: string
    ListComponent: React.FC<ICiListContainerView<T>>
    defaultFilterValues: T
    defaultFilterOperators?: T
}

export const CiListContainer = <T extends FieldValues & IFilterParams>({
    entityName,
    POType,
    ListComponent,
    defaultFilterValues,
    defaultFilterOperators,
}: ICiListContainer<T>) => {
    const { columnListData, saveColumnSelection, resetColumns, isLoading: isColumnsLoading, isError: isColumnsError } = useGetColumnData(entityName)
    const { currentPreferences } = useUserPreferences()

    const defaultRequestApi = {
        filter: {
            type: [entityName],
        },
    }

    const { filterToNeighborsApi, filterParams, handleFilterChange } = useFilterForCiList<T, CiListFilterContainerUi>(
        defaultFilterValues,
        defaultRequestApi,
    )

    const {
        attributeProfiles,
        constraintsData,
        unitsData,
        ciTypeData,
        attributes,
        isError: isAttributesError,
        isLoading: isAttributesLoading,
    } = useAttributesHook(entityName)

    const liableEntity = currentPreferences.myPO ? [currentPreferences.myPO] : undefined
    const state = filterParams.evidence_status?.length
        ? filterParams.evidence_status
        : currentPreferences.showInvalidatedItems
        ? ['DRAFT', 'INVALIDATED']
        : ['DRAFT']
    const metaAttributes = { state: state, liableEntity, ...filterParams.metaAttributeFilters }

    const {
        data: tableData,
        isLoading: isReadCiListLoading,
        isFetching: isReadCiListFetching,
        isError: isReadCiListError,
        refetch,
    } = useReadCiList1({
        ...filterToNeighborsApi,
        filter: {
            ...filterToNeighborsApi.filter,
            fullTextSearch: filterParams.fullTextSearch || '',
            attributes: mapFilterParamsToApi({ ...filterParams, evidence_status: undefined }, defaultFilterOperators),
            metaAttributes,
        },
    })

    const ownerGids = new Set(tableData?.configurationItemSet?.map((item) => item.metaAttributes?.owner ?? ''))
    const {
        data: gestorsData,
        isLoading: isGestorsLoading,
        isError: isGestorsError,
        fetchStatus,
    } = useGetRoleParticipantBulk({ gids: [...ownerGids] }, { query: { enabled: !!tableData && ownerGids && [...ownerGids]?.length > 0 } })

    const pagination = usePagination(tableData, filterParams)

    const isGestorsLoadingCombined = isGestorsLoading && fetchStatus != 'idle'
    const isLoading = [isReadCiListLoading, isReadCiListFetching, isColumnsLoading, isGestorsLoadingCombined, isAttributesLoading].some(
        (item) => item,
    )
    const isError = [isReadCiListError, isColumnsError, isGestorsError, isAttributesError].some((item) => item)

    return (
        <ListComponent
            defaultFilterValues={defaultFilterValues}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            resetUserSelectedColumns={resetColumns}
            storeUserSelectedColumns={saveColumnSelection}
            refetch={refetch}
            sort={filterParams?.sort ?? []}
            isLoading={isLoading}
            isError={isError}
            columnListData={columnListData}
            gestorsData={gestorsData}
            tableData={tableData}
            attributeProfiles={attributeProfiles}
            attributes={attributes}
            constraintsData={constraintsData}
            unitsData={unitsData}
            ciTypeData={ciTypeData}
            entityName={entityName}
            POType={POType ?? ''}
        />
    )
}
