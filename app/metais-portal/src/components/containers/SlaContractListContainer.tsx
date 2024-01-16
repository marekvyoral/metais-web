import React, { useMemo } from 'react'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { EnumType, useGetEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ColumnSort, IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { removeNullPropertiesFromRecord } from '@isdd/metais-common/utils/utils'
import { ApiSlaContractReadList, ListSlaContractsParams, useListSlaContracts } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { UserPreferencesFormNamesEnum, useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { FAZA_KONTRAKTU } from '@isdd/metais-common/constants'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'

import { MainContentWrapper } from '@/components/MainContentWrapper'

export interface ISlaContractData {
    slaContractsData: ApiSlaContractReadList | undefined
    contractPhaseData: EnumType | undefined
}

export interface ISlaContractListView {
    data: ISlaContractData
    defaultFilterValues: ListSlaContractsParams
    handleFilterChange: (changedFilter: IFilter) => void
    isLoading: boolean
    isError: boolean
    sort: ColumnSort[]
}

interface ISlaContractListContainer {
    View: React.FC<ISlaContractListView>
    defaultFilterValues: ListSlaContractsParams
}

export enum StatusFilterOptions {
    ALL = 'A',
    ACTIVE = 'V',
    INACTIVE = 'I',
}

export const SlaContractListContainer: React.FC<ISlaContractListContainer> = ({ View, defaultFilterValues }) => {
    const { filter, handleFilterChange } = useFilterParams<IFilter & ListSlaContractsParams>(defaultFilterValues)
    const { currentPreferences } = useUserPreferences()

    const filterForApi: ListSlaContractsParams = {
        name: filter.name,
        phase: filter.phase,
        consumerMainPersonUuid: filter.consumerMainPersonUuid,
        consumerProjectUuid: filter.consumerProjectUuid,
        consumerServiceUuid: filter.consumerServiceUuid,
        providerMainPersonUuid: filter.providerMainPersonUuid,
        providerProjectUuid: filter.providerProjectUuid,
        providerServiceUuid: filter.providerServiceUuid,
        intervalEnd: filter.intervalEnd,
        intervalStart: filter.intervalStart,
        statusFilter: filter.statusFilter ?? StatusFilterOptions.ALL,
        page: filter.pageNumber,
        perPageSize: filter.pageSize,
        sortBy: filter?.sort?.[0]?.orderBy ?? ATTRIBUTE_NAME.createdAt,
        ascending: filter?.sort?.[0]?.sortDirection === SortType.ASC,
        onlyDraftState: !currentPreferences[UserPreferencesFormNamesEnum.SHOW_INVALIDATED],
    }

    const { data: slaContractsData, isError, isLoading, isFetching } = useListSlaContracts(removeNullPropertiesFromRecord(filterForApi))
    const { data: contractPhaseData, isError: isContractPhaseError, isLoading: isContractPhaseLoading } = useGetEnum(FAZA_KONTRAKTU)

    const combinedData: ISlaContractData = useMemo(() => {
        return {
            slaContractsData,
            contractPhaseData,
        }
    }, [contractPhaseData, slaContractsData])

    return (
        <MainContentWrapper>
            <View
                data={combinedData}
                isError={isError || isContractPhaseError}
                isLoading={isLoading || isContractPhaseLoading || isFetching}
                defaultFilterValues={defaultFilterValues}
                handleFilterChange={handleFilterChange}
                sort={filter?.sort ?? []}
            />
        </MainContentWrapper>
    )
}
