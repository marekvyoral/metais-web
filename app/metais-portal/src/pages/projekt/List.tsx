import React from 'react'

import { ProjectListContainer } from '@/components/containers/ProjectListContainer'
import { ListTable } from '@/components/list-table/ListTable'

export interface IListView {
    entityStructure: object
    columnListData: object
    unitsData: object
    constraintsData: object
    tableData: object
}

const ListView: React.FC<IListView> = ({ entityStructure, columnListData, constraintsData, tableData, unitsData }) => {
    return (
        <>
            {/*
            ListFilter
            Actions
             */}
            <ListTable data={{ entityStructure, columnListData, constraintsData, tableData, unitsData }} />
        </>
    )
}

export const List: React.FC = () => {
    const Loading = () => <div>Loading</div>
    const Error = () => <div>Error</div>

    return (
        <>
            <ProjectListContainer entityName="Projekt" View={ListView} LoadingView={Loading} ErrorView={Error} />
        </>
    )
}
