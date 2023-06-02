import React, { useState } from 'react'

import { useEntityStructure } from '@/hooks/useEntityStructure'
import { useColumnList } from '@/hooks/useColumnList'
import { IListView } from '@/pages/projekt/create'
import { ITableDataParams } from '@/api/TableApi'
import { useTableData } from '@/hooks/useTableData'

interface IProjectListContainer {
    entityName: string
    View: React.FC<IListView>
    LoadingView: React.FC
    ErrorView: React.FC
}

export const ProjectListContainer: React.FC<IProjectListContainer> = ({ entityName, View, LoadingView, ErrorView }) => {
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

    if (isLoading || isColumnListLoading || isTableDataLoading) {
        return <LoadingView />
    }

    if (isError || isColumnListError || isTableDataError) {
        return <ErrorView />
    }

    return (
        <View
            entityStructure={entityStructure}
            columnListData={columnListData}
            tableData={tableData}
            unitsData={unitsData}
            constraintsData={constraintsData}
            setTableParams={setTableParams}
            tableParams={tableParams}
        />
    )
}
