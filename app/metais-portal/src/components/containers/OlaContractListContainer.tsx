import { ColumnSort, IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { ApiError, Role, useFindAll11 } from '@isdd/metais-common/api/generated/iam-swagger'
import {
    ApiOlaContractDataList,
    ApiSlaContractReadList,
    ListOlaContractListParams,
    ListSlaContractsParams,
    useListOlaContractList,
} from '@isdd/metais-common/api/generated/monitoring-swagger'
import { SLA_SPRAVA, STAV_OLA_KONTRAKT } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { UserPreferencesFormNamesEnum, useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { removeNullPropertiesFromRecord } from '@isdd/metais-common/utils/utils'
import React, { useEffect, useState } from 'react'
import { EnumItem, useGetEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { getGId } from '@/components/views/ola-contract-list/helper'

export interface IOlaContractListView {
    data?: ApiSlaContractReadList
    defaultFilterValues: ListOlaContractListParams
    handleFilterChange: (changedFilter: IFilter) => void
    isLoading: boolean
    isError: boolean
    sort: ColumnSort[]
    ownerGid?: string
    statesEnum?: EnumItem[]
    refetch: <TPageData>(options?: RefetchOptions & RefetchQueryFilters<TPageData>) => Promise<QueryObserverResult<ApiOlaContractDataList, ApiError>>
}

interface IOlaContractListContainer {
    View: React.FC<IOlaContractListView>
    defaultFilterValues: ListSlaContractsParams
}

export const OlaContractListContainer: React.FC<IOlaContractListContainer> = ({ View, defaultFilterValues }) => {
    const { filter, handleFilterChange } = useFilterParams<IFilter & ListOlaContractListParams>(defaultFilterValues)
    const { currentPreferences } = useUserPreferences()

    const filterForApi: ListOlaContractListParams = {
        ...(filter.name && { name: filter.name }),
        ...(filter?.attributeFilters?.contractCode && {
            contractCode: filter?.attributeFilters?.contractCode?.[0]?.value ?? filter.contractCode,
        }),
        validityStart: filter.validityStart,
        ...(filter?.attributeFilters?.validityStart && {
            validityStart: filter?.attributeFilters?.validityStart?.[0]?.value ?? filter.validityStart,
        }),
        validityEnd: filter.validityEnd,
        ...(filter?.attributeFilters?.validityEnd && {
            validityEnd: filter?.attributeFilters?.validityEnd?.[0]?.value ?? filter.validityEnd,
        }),
        ...(filter?.attributeFilters?.contractorIsvsUuid && {
            contractorIsvsUuid: filter?.attributeFilters?.contractorIsvsUuid?.[0]?.value ?? filter.contractorIsvsUuid,
        }),
        ...(filter?.attributeFilters?.liableEntities && {
            liableEntities: filter?.attributeFilters?.liableEntities?.map((e: { value: string }) => e.value) ?? filter.liableEntities,
        }),
        ...(filter?.attributeFilters?.metaIsCode && {
            metaIsCode: filter?.attributeFilters?.metaIsCode?.[0]?.value ?? filter.metaIsCode,
        }),
        page: filter.pageNumber,
        perPageSize: filter.pageSize,
        sortBy: filter?.sort?.[0]?.orderBy ?? ATTRIBUTE_NAME.lastModifiedAt,
        ascending: filter?.sort?.[0]?.sortDirection === SortType.ASC,
        onlyDraftState: !currentPreferences[UserPreferencesFormNamesEnum.SHOW_INVALIDATED],
    }

    const [ownerGid, setOwnerGid] = useState<string>()
    const {
        state: { user },
    } = useAuth()
    const { data: slaContractsData, isError, isLoading, isFetching, refetch } = useListOlaContractList(removeNullPropertiesFromRecord(filterForApi))
    const { data: roleData } = useFindAll11({ name: SLA_SPRAVA })
    const {
        data: statesEnum,
        isLoading: isStatesLoading,
        isError: isStatesError,
    } = useGetEnum(STAV_OLA_KONTRAKT, { query: { select: (data) => data.enumItems } })
    useEffect(() => {
        if (roleData) {
            setOwnerGid(getGId(user?.groupData ?? [], (roleData as Role).uuid ?? ''))
        }
    }, [roleData, user?.groupData])
    return (
        <MainContentWrapper>
            <View
                refetch={refetch}
                ownerGid={ownerGid}
                data={slaContractsData}
                isError={isError || isStatesError}
                isLoading={isLoading || isFetching || isStatesLoading}
                defaultFilterValues={defaultFilterValues}
                handleFilterChange={handleFilterChange}
                sort={filter?.sort ?? []}
                statesEnum={statesEnum}
            />
        </MainContentWrapper>
    )
}
