import React, { useState } from 'react'

import { useEntityStructure } from '@/hooks/useEntityStructure'
import { CiListFilterContainerUi, useGetDefaultColumnsUsingGET, BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@/api'
import { useCiQuery } from '@/hooks/useCiQuery'
import { IListView } from '@/types/list'

interface ICiListContainer {
    entityName: string
    ListComponent: React.FC<IListView>
}

export const CiListContainer: React.FC<ICiListContainer> = ({ entityName, ListComponent }) => {
    const { ciTypeData: entityStructure, unitsData, constraintsData } = useEntityStructure(entityName)
    const { data: columnListData } = useGetDefaultColumnsUsingGET(entityName)

    const defaultListQueryArgs: CiListFilterContainerUi = {
        filter: {
            type: [entityName],
            metaAttributes: {
                state: ['DRAFT'],
            },
        },
        sortBy: 'Gen_Profil_nazov',
        sortType: 'ASC',
        //they have it switched in api?
        page: BASE_PAGE_SIZE,
        perpage: BASE_PAGE_NUMBER,
    }

    const [listQueryArgs, setListQueryArgs] = useState<CiListFilterContainerUi>(defaultListQueryArgs)

    // const { data: tableData, isLoading, isError } = useReadCiListUsingPOST(listQueryArgs, {}, {})
    const { data: tableData } = useCiQuery(entityName, listQueryArgs)

    return (
        <ListComponent
            data={{ entityStructure, unitsData, constraintsData, columnListData, tableData }}
            filterCallbacks={{ setListQueryArgs }}
            filter={listQueryArgs}
        />
    )
}
