import React, { SetStateAction } from 'react'

import { CiListContainer } from '@/components/containers/CiListContainer'
import { CiTable } from '@/components/ci-table/CiTable'
import { IListQueryArgs } from '@/api/TableApi'
import { IColumn } from '@/hooks/useColumnList'
import { ICiQueryData } from '@/hooks/useCiQuery'
import { IEnumData } from '@/hooks/useHowToDisplay'

export interface IListData {
    //placeholder types
    entityStructure: object
    columnListData: IColumn | undefined
    unitsData: IEnumData | undefined
    constraintsData: (IEnumData | undefined)[]
    tableData: ICiQueryData | undefined
}

export interface IListFilterCallbacks {
    setListQueryArgs: React.Dispatch<SetStateAction<IListQueryArgs>>
}

export interface IListView {
    data: IListData
    filterCallbacks: IListFilterCallbacks
    filter: IListQueryArgs
}

const ProjektListPage: React.FC = () => {
    return (
        <CiListContainer
            entityName="Projekt"
            ListComponent={({ data, filterCallbacks, filter }) => (
                <>
                    {/* 
            ProjektFilter
            ProjektActions
            */}
                    <CiTable data={data} filterCallbacks={filterCallbacks} filter={filter} />
                </>
            )}
        />
    )
}

export default ProjektListPage
