import { ColumnSort, IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import {
    ApiSlaContractReadList,
    ListOlaContractListParams,
    ListSlaContractsParams,
    useListOlaContractList,
} from '@isdd/metais-common/api/generated/monitoring-swagger'
import { UserPreferencesFormNamesEnum, useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { removeNullPropertiesFromRecord } from '@isdd/metais-common/utils/utils'
import React from 'react'

import { MainContentWrapper } from '@/components/MainContentWrapper'

export interface IAdditionalFilterField extends ListOlaContractListParams {
    liableEntities?: string[]
}
export interface IOlaContractListView {
    data?: ApiSlaContractReadList
    defaultFilterValues: IAdditionalFilterField
    handleFilterChange: (changedFilter: IFilter) => void
    isLoading: boolean
    isError: boolean
    sort: ColumnSort[]
}

interface IOlaContractListContainer {
    View: React.FC<IOlaContractListView>
    defaultFilterValues: ListSlaContractsParams
}

export const OlaContractListContainer: React.FC<IOlaContractListContainer> = ({ View, defaultFilterValues }) => {
    const { filter, handleFilterChange } = useFilterParams<IFilter & IAdditionalFilterField>(defaultFilterValues)
    const { currentPreferences } = useUserPreferences()

    const filterForApi: ListOlaContractListParams = {
        name: filter.name,
        contractCode: filter.contractCode,
        validityStart: filter.validityStart,
        validityEnd: filter.validityEnd,
        contractorIsvsUuid: filter.contractorIsvsUuid,
        'liableEntities[]': filter.liableEntities,
        metaIsCode: filter.metaIsCode,
        page: filter.pageNumber,
        perPageSize: filter.pageSize,
        sortBy: filter?.sort?.[0]?.orderBy ?? ATTRIBUTE_NAME.createdAt,
        ascending: filter?.sort?.[0]?.sortDirection === SortType.ASC,
        onlyDraftState: !currentPreferences[UserPreferencesFormNamesEnum.SHOW_INVALIDATED],
    }

    const { data: slaContractsData, isError, isLoading, isFetching } = useListOlaContractList(removeNullPropertiesFromRecord(filterForApi))

    return (
        <MainContentWrapper>
            <View
                data={slaContractsData}
                isError={isError}
                isLoading={isLoading || isFetching}
                defaultFilterValues={defaultFilterValues}
                handleFilterChange={handleFilterChange}
                sort={filter?.sort ?? []}
            />
        </MainContentWrapper>
    )
}
