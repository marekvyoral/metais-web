import React, { useMemo } from 'react'
import { ApiIntegrationLinkList, ListIntegrationLinksParams, useListIntegrationLinks } from '@isdd/metais-common/api/generated/provisioning-swagger'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { EnumType, useGetEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ColumnSort, IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { STAV_DIZ_ENUM_CODE } from '@isdd/metais-common/constants'
import { removeNullPropertiesFromRecord } from '@isdd/metais-common/utils/utils'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CustomListIntegrationLinksParams } from '@/pages/prov-integration/list'

export interface IProvIntegrationData {
    listIntegrationLinks: ApiIntegrationLinkList | undefined
    dizStateData: EnumType | undefined
}

export interface IProvIntegrationListView {
    data: IProvIntegrationData
    defaultFilterValues: CustomListIntegrationLinksParams
    handleFilterChange: (changedFilter: IFilter) => void
    isLoading: boolean
    isError: boolean
    sort: ColumnSort[]
}

interface IProvIntegrationListContainer {
    View: React.FC<IProvIntegrationListView>
    defaultFilterValues: CustomListIntegrationLinksParams
}

export const ProvIntegrationListContainer: React.FC<IProvIntegrationListContainer> = ({ View, defaultFilterValues }) => {
    const { filter, handleFilterChange } = useFilterParams<CustomListIntegrationLinksParams & IFilter>(defaultFilterValues)

    const filterForApi: ListIntegrationLinksParams = {
        page: filter.pageNumber,
        perPageSize: filter.pageSize,
        itemState: filter.itemState,
        dizState: filter.dizState,
        integrationName: filter.integrationName,
        'providingProjects[]': filter['providingProjects'],
        'consumingProjects[]': filter['consumingProjects'],
        'consumingIsvs[]': filter['consumingIsvs'],
        'providingIsvs[]': filter['providingIsvs'],
        'consumingPo[]': filter['consumingPo'],
        'providingPo[]': filter['providingPo'],
        sortBy: filter?.sort?.[0]?.orderBy,
        ascending: filter?.sort?.[0]?.sortDirection === SortType.ASC,
    }

    const { data: listIntegrationLinks, isError, isLoading, isFetching } = useListIntegrationLinks(removeNullPropertiesFromRecord(filterForApi))
    const { data: dizStateData, isError: isDizStateError, isLoading: isDizStateLoading } = useGetEnum(STAV_DIZ_ENUM_CODE)

    const combinedData: IProvIntegrationData = useMemo(() => {
        return {
            listIntegrationLinks,
            dizStateData,
        }
    }, [dizStateData, listIntegrationLinks])

    return (
        <MainContentWrapper>
            <View
                data={combinedData}
                isError={isError || isDizStateError}
                isLoading={isLoading || isDizStateLoading || isFetching}
                defaultFilterValues={defaultFilterValues}
                handleFilterChange={handleFilterChange}
                sort={filter?.sort ?? []}
            />
        </MainContentWrapper>
    )
}
