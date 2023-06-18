import React, { SetStateAction } from 'react'
import { useParams } from 'react-router-dom'

import { CiListContainer } from '@/components/containers/CiListContainer'
import { CiTable } from '@/components/ci-table/CiTable'
import { IColumn } from '@/hooks/useColumnList'
import { CiType } from '@/api/generated/types-repo-swagger'
import { EnumType } from '@/api/generated/enums-repo-swagger'
import { CiListFilterContainerUi, ReadCiListUsingPOST200 } from '@/api/generated/cmdb-swagger'

export interface IListData {
    entityStructure: CiType | undefined
    columnListData: IColumn | undefined
    unitsData: EnumType | undefined
    constraintsData: (EnumType | undefined)[]
    tableData: void | ReadCiListUsingPOST200 | undefined
}

export interface IListFilterCallbacks {
    setListQueryArgs: React.Dispatch<SetStateAction<CiListFilterContainerUi>>
}

export interface IListView {
    data: IListData
    filterCallbacks: IListFilterCallbacks
    filter: CiListFilterContainerUi
}

const ProjektListPage: React.FC = () => {
    const { entityName } = useParams()
    return (
        <CiListContainer
            entityName={entityName ?? ''}
            ListComponent={({ data, filterCallbacks, filter }) => (
                <>
                    {/* 
            Filter
            Actions
            */}
                    <CiTable data={data} filterCallbacks={filterCallbacks} filter={filter} />
                </>
            )}
        />
    )
}

export default ProjektListPage
