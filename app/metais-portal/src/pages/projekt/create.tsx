import React, { SetStateAction } from 'react'

import { ProjectListContainer } from '@/components/containers/ProjectListContainer'
import { ListTable } from '@/components/projekt-list-table/ProjektListTable'
import { ITableDataParams } from '@/api/TableApi'

export interface IListView {
    entityStructure: object
    columnListData: object
    unitsData: object
    constraintsData: object
    tableData: object
    setTableParams: React.Dispatch<SetStateAction<ITableDataParams>>
    tableParams: ITableDataParams
}

const ListView: React.FC<IListView> = ({ entityStructure, columnListData, constraintsData, tableData, unitsData, setTableParams, tableParams }) => {
    return (
        <>
            {/*
            ListFilter
            Actions
             */}
            <ListTable data={{ entityStructure, columnListData, constraintsData, tableData, unitsData, setTableParams, tableParams }} />
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
