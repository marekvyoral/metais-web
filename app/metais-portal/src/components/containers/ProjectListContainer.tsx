import React from 'react'

import { useEntityStructure } from '@/hooks/useEntityStructure'
import { useColumnList } from '@/hooks/useColumnList'

interface IView {
    data: object
}

interface IProjectListContainer {
    entityName: string
    View: React.FC<IView>
    LoadingView: React.FC
    ErrorView: React.FC
}

export const ProjectListContainer: React.FC<IProjectListContainer> = ({ entityName, View, LoadingView, ErrorView }) => {
    const { isLoading, isError, data, unitsData, constraintsData } = useEntityStructure(entityName)
    const { isLoading: isColumnListLoading, isError: isColumnListError, data: columnListData } = useColumnList(entityName)

    if (isLoading || isColumnListLoading) {
        return <LoadingView />
    }

    if (isError || isColumnListError) {
        return <ErrorView />
    }

    return <View data={{ data, columnListData, unitsData, constraintsData }} />
}
