import React, { useState } from 'react'

import { useEntityStructure } from '@/hooks/useEntityStructure'
import { useColumnList } from '@/hooks/useColumnList'
import { IListView } from '@/pages/projekt/index'
import { ITableDataParams } from '@/api/TableApi'
import { useTableData } from '@/hooks/useTableData'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@/constants/constants'

interface ICiListContainer {
    entityName: string
    View: React.FC<IListView>
}

export const CiListContainer: React.FC<ICiListContainer> = ({ entityName, View }) => {
    const { isLoading, isError, data: entityStructure, unitsData, constraintsData } = useEntityStructure(entityName)
    const { isLoading: isColumnListLoading, isError: isColumnListError, data: columnListData } = useColumnList(entityName)

    //what parameters should it call by default?
    const defaultParams: ITableDataParams = {
        filter: { type: ['Program'], metaAttributes: { state: ['DRAFT'] } },
        sortBy: 'Gen_Profil_nazov',
        sortType: 'ASC',
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
    }
    const [tableParams, setTableParams] = useState<ITableDataParams>(defaultParams)

    //post call for table data
    const { isLoading: isTableDataLoading, isError: isTableDataError, data: tableData } = useTableData(tableParams)

    return (
        <View data={{ entityStructure, unitsData, constraintsData, columnListData, tableData }} filterCallbacks={{ setTableParams, tableParams }} />
    )
}
