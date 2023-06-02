import React, { SetStateAction } from 'react'

import { ProjectListContainer } from '@/components/containers/ProjectListContainer'
import { ProjektListTable } from '@/components/projekt-list-table/ProjektListTable'
import { ITableDataParams } from '@/api/TableApi'

export interface IListData {
    //placeholder types
    entityStructure: object
    columnListData: object
    unitsData: object
    constraintsData: object
    tableData: object
}

export interface IListFilterCallbacks {
    setTableParams: React.Dispatch<SetStateAction<ITableDataParams>>
    tableParams: ITableDataParams
}

export interface IListView {
    data: IListData
    filterCallbacks: IListFilterCallbacks
}

export const List: React.FC = () => {
    return (
        <ProjectListContainer
            entityName="Projekt"
            View={({ data, filterCallbacks }) => (
                <>
                    {/* 
            ProjektFilter
            ProjektActions
            */}
                    <ProjektListTable data={data} filterCallbacks={filterCallbacks} />
                </>
            )}
        />
    )
}
