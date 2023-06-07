import React, { useState } from 'react'

import { useEntityStructure } from '@/hooks/useEntityStructure'
import { useColumnList } from '@/hooks/useColumnList'
import { IListView } from '@/pages/projekt/index'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@/api/constants'
import { useCiQuery } from '@/hooks/useCiQuery'
import { IListQueryArgs } from '@/api/TableApi'

interface ICiListContainer {
    entityName: string
    ListComponent: React.FC<IListView>
}

export const CiListContainer: React.FC<ICiListContainer> = ({ entityName, ListComponent }) => {
    const { isLoading, isError, ciTypeData: entityStructure, unitsData, constraintsData } = useEntityStructure(entityName)
    const { isLoading: isColumnListLoading, isError: isColumnListError, data: columnListData } = useColumnList(entityName)

    const defaultListQueryArgs = {
        filter: { type: ['Program'], metaAttributes: { state: ['DRAFT'] } },
        sortBy: 'Gen_Profil_nazov',
        sortType: 'ASC',
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
    }

    const [listQueryArgs, setListQueryArgs] = useState<IListQueryArgs>(defaultListQueryArgs)

    const { isLoading: isTableDataLoading, isError: isTableDataError, data: tableData } = useCiQuery(listQueryArgs)

    return (
        <ListComponent
            data={{ entityStructure, unitsData, constraintsData, columnListData, tableData }}
            filterCallbacks={{ setListQueryArgs }}
            filter={listQueryArgs}
        />
    )
}
