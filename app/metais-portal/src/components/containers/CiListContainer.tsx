import React, { useState } from 'react'
import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { useGetDefaultColumnsUsingGET, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, useReadCiListUsingPOST } from '@isdd/metais-common/api'

import { IListView } from '@/types/list'
import { mapFilterToNeighborsApi } from '@/componentHelpers'
import { mapConfigurationItemSetToPagination } from '@/componentHelpers/pagination'

interface ICiListContainer {
    entityName: string
    ListComponent: React.FC<IListView>
}

export const CiListContainer: React.FC<ICiListContainer> = ({ entityName, ListComponent }) => {
    const { data: columnListData } = useGetDefaultColumnsUsingGET(entityName)

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

    const { data: tableData } = useReadCiListUsingPOST(mapFilterToNeighborsApi(uiFilterState, defaultRequestApi))

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
