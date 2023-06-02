import React, { SetStateAction } from 'react'

import { CiListContainer } from '@/components/containers/CiListContainer'
import { CiTable } from '@/components/ci-table/CiTable'
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
        <CiListContainer
            entityName="Projekt"
            View={({ data, filterCallbacks }) => (
                <>
                    {/* 
            ProjektFilter
            ProjektActions
            */}
                    <CiTable data={data} filterCallbacks={filterCallbacks} />
                </>
            )}
        />
    )
}
