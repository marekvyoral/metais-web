import React, { useState } from 'react'
import { IFilter } from '@isdd/idsk-ui-kit/types'

import { CiListFilterContainerUi, useGetDefaultColumnsUsingGET, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, useReadCiListUsingPOST } from '@/api'
import { IListView } from '@/types/list'
import { mapFilterToNeighborsApi } from '@/componentHelpers'
import { mapConfigurationItemSetToPagination } from '@/componentHelpers/pagination'

interface ICiListContainer {
    entityName: string
    ListComponent: React.FC<IListView>
}

export const CiListContainer: React.FC<ICiListContainer> = ({ entityName, ListComponent }) => {
    const { data: columnListData } = useGetDefaultColumnsUsingGET(entityName)

    const defaultRequestApi: CiListFilterContainerUi = {
        filter: {
            type: [entityName],
            metaAttributes: {
                state: ['DRAFT'],
            },
        },
        sortBy: 'Gen_Profil_nazov',
        sortType: 'ASC',
        //they have it switched in api?
        page: BASE_PAGE_NUMBER,
        perpage: BASE_PAGE_SIZE,
    }

    const [requestApi, setRequestApi] = useState<CiListFilterContainerUi>(defaultRequestApi)

    const handleFilterChange = (filter: IFilter) => {
        setRequestApi(mapFilterToNeighborsApi(requestApi, filter))
    }

    const { data: tableData } = useReadCiListUsingPOST(requestApi)

    const pagination = mapConfigurationItemSetToPagination(requestApi, tableData)

    return <ListComponent data={{ columnListData, tableData }} pagination={pagination} handleFilterChange={handleFilterChange} />
}
