import React, { useState } from 'react'

import { useEntityStructure } from '@/hooks/useEntityStructure'
import { useColumnList } from '@/hooks/useColumnList'
import { IListView } from '@/pages/projekt/index'
import { ITableDataParams } from '@/api/TableApi'
import { useTableData } from '@/hooks/useTableData'

interface IProjectListContainer {
    entityName: string
    View: React.FC<IListView>
}

export const ProjectListContainer: React.FC<IProjectListContainer> = ({ entityName, View }) => {
    const { isLoading, isError, data: entityStructure, unitsData, constraintsData } = useEntityStructure(entityName)
    const { isLoading: isColumnListLoading, isError: isColumnListError, data: columnListData } = useColumnList(entityName)

    const defaultParams: ITableDataParams = {
        filter: { type: ['Program'], metaAttributes: { state: ['DRAFT'] } },
        sortBy: 'Gen_Profil_nazov',
        sortType: 'ASC',
        //pagination
        page: 1,
        perpage: 7,
    }
    const [tableParams, setTableParams] = useState<ITableDataParams>(defaultParams)
    //post call for table data
    const { isLoading: isTableDataLoading, isError: isTableDataError, data: tableData } = useTableData(tableParams)

    return (
        <View data={{ entityStructure, unitsData, constraintsData, columnListData, tableData }} filterCallbacks={{ setTableParams, tableParams }} />
    )
}
