import { useQuery } from '@tanstack/react-query'
import React from 'react'

import { getColumnList, getEntityStructure } from '../api/TableApi'

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
    const { isLoading, isError, data } = useQuery({
        queryKey: ['entityStructure', entityName],
        queryFn: () => getEntityStructure(entityName),
    })

    const {
        isLoading: isColumnLoading,
        isError: isColumnError,
        data: columnsList,
    } = useQuery({
        queryKey: ['columnsList', entityName],
        queryFn: () => getColumnList(entityName),
    })

    if (isLoading || isColumnLoading) {
        return <LoadingView />
    }

    if (isError || isColumnError) {
        return <ErrorView />
    }

    return <View data={{ data, columnsList }} />
}
