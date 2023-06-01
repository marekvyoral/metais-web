import React from 'react'

import { useEntityStructure } from '@/hooks/useEntityStructure'
import { useColumnList } from '@/hooks/useColumnList'
import { IListView } from '@/pages/projekt/List'

interface IProjectListContainer {
    entityName: string
    View: React.FC<IListView>
    LoadingView: React.FC
    ErrorView: React.FC
}

export const ProjectListContainer: React.FC<IProjectListContainer> = ({ entityName, View, LoadingView, ErrorView }) => {
    const { isLoading, isError, data: entityStructure, unitsData, constraintsData } = useEntityStructure(entityName)
    const { isLoading: isColumnListLoading, isError: isColumnListError, data: columnListData } = useColumnList(entityName)

    //post call for table data ?

    if (isLoading || isColumnListLoading) {
        return <LoadingView />
    }

    if (isError || isColumnListError) {
        return <ErrorView />
    }

    return (
        <View
            entityStructure={entityStructure}
            columnListData={columnListData}
            tableData={{}}
            unitsData={unitsData}
            constraintsData={constraintsData}
        />
    )
}
