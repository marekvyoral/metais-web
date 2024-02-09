import { ColumnSort, IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { Role, useFindAll11 } from '@isdd/metais-common/api/generated/iam-swagger'
import {
    ApiSlaContractReadList,
    ListOlaContractListParams,
    ListSlaContractsParams,
    useListOlaContractList,
} from '@isdd/metais-common/api/generated/monitoring-swagger'
import { SLA_SPRAVA } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { UserPreferencesFormNamesEnum, useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { removeNullPropertiesFromRecord } from '@isdd/metais-common/utils/utils'
import React, { useEffect, useState } from 'react'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { getGId } from '@/components/views/ola-contract-list/helper'

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
    ownerGid?: string
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
        liableEntities: filter.liableEntities,
        metaIsCode: filter.metaIsCode,
        page: filter.pageNumber,
        perPageSize: filter.pageSize,
        sortBy: filter?.sort?.[0]?.orderBy ?? ATTRIBUTE_NAME.createdAt,
        ascending: filter?.sort?.[0]?.sortDirection === SortType.ASC,
        onlyDraftState: !currentPreferences[UserPreferencesFormNamesEnum.SHOW_INVALIDATED],
    }
    const [ownerGid, setOwnerGid] = useState<string>()
    const {
        state: { user },
    } = useAuth()
    const { data: slaContractsData, isError, isLoading, isFetching } = useListOlaContractList(removeNullPropertiesFromRecord(filterForApi))
    const { data: roleData } = useFindAll11({ name: SLA_SPRAVA })
    useEffect(() => {
        if (roleData) {
            setOwnerGid(getGId(user?.groupData ?? [], (roleData as Role).uuid ?? ''))
        }
    }, [roleData, user?.groupData])
    return (
        <MainContentWrapper>
            <View
                ownerGid={ownerGid}
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
