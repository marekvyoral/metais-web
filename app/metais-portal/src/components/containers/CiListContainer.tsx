import React, { useState } from 'react'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { FieldValues } from 'react-hook-form'
import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'

import { useGetDefaultColumnsUsingGET, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, useReadCiListUsingPOST } from '@/api'
import { IListView } from '@/types/list'
import { mapFilterParamsToApi, mapFilterToNeighborsApi } from '@/componentHelpers'
import { mapConfigurationItemSetToPagination } from '@/componentHelpers/pagination'

interface ICiListContainer<T> {
    entityName: string
    ListComponent: React.FC<IListView>
    defaultFilterValues: T
}

export const CiListContainer = <T extends FieldValues & IFilterParams>({ entityName, ListComponent, defaultFilterValues }: ICiListContainer<T>) => {
    const { data: columnListData } = useGetDefaultColumnsUsingGET(entityName)
    const [filterParams] = useFilterParams<T>(defaultFilterValues)

    const [uiFilterState, setUiFilterState] = useState<IFilter>({
        sort: [{ orderBy: 'Gen_Profil_nazov', sortDirection: SortType.ASC }],
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
    })

    const defaultRequestApi = {
        filter: {
            type: [entityName],
            metaAttributes: {
                state: ['DRAFT'],
            },
        },
    }

    const handleFilterChange = (filter: IFilter) => {
        setUiFilterState({
            ...uiFilterState,
            ...filter,
        })
    }
    const filterToNeighborsApi = mapFilterToNeighborsApi(uiFilterState, defaultRequestApi)
    const { data: tableData } = useReadCiListUsingPOST({
        ...filterToNeighborsApi,
        filter: {
            ...filterToNeighborsApi.filter,
            fullTextSearch: filterParams.fullTextSearch || '',
            attributes: mapFilterParamsToApi(filterParams),
        },
    })

    const pagination = mapConfigurationItemSetToPagination(uiFilterState, tableData)

    return (
        <ListComponent
            data={{ columnListData, tableData }}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            sort={uiFilterState?.sort ?? []}
        />
    )
}
