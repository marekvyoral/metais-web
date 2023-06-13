import React, { useState } from 'react'

import { useEntityStructure } from '@/hooks/useEntityStructure'
import { useColumnList } from '@/hooks/useColumnList'
import { IListView } from '@/pages/projekt/index'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@/api/constants'
import { CiListFilterContainerUi } from '@/api/generated/cmdb-swagger'
import { useCiQuery } from '@/hooks/useCiQuery'

interface ICiListContainer {
    entityName: string
    ListComponent: React.FC<IListView>
}

export const CiListContainer: React.FC<ICiListContainer> = ({ entityName, ListComponent }) => {
    const { ciTypeData: entityStructure, unitsData, constraintsData } = useEntityStructure(entityName)
    const { data: columnListData } = useColumnList(entityName)

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
