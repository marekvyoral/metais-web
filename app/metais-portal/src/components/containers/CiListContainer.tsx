import React, { useState } from 'react'

import { CiListFilterContainerUi, useGetDefaultColumnsUsingGET, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, useReadCiListUsingPOST } from '@/api'
import { IListView } from '@/types/list'

interface ICiListContainer {
    entityName: string
    ListComponent: React.FC<IListView>
}

export const CiListContainer: React.FC<ICiListContainer> = ({ entityName, ListComponent }) => {
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
        page: BASE_PAGE_NUMBER,
        perpage: BASE_PAGE_SIZE,
    }

    const [listQueryArgs, setListQueryArgs] = useState<CiListFilterContainerUi>(defaultListQueryArgs)

    const { data: tableData } = useReadCiListUsingPOST(listQueryArgs)

    return <ListComponent data={{ columnListData, tableData }} filterCallbacks={{ setListQueryArgs }} filter={listQueryArgs} />
}
