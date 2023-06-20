import React, { SetStateAction } from 'react'
import { useParams } from 'react-router-dom'

import { CiListContainer } from '@/components/containers/CiListContainer'
import { CiTable } from '@/components/ci-table/CiTable'
import { IColumn } from '@/hooks/useColumnList'
import { CiListFilterContainerUi, ConfigurationItemSetUi, EnumType, CiType } from '@/api'
import { AttributesContainer } from '@/components/containers/AttributesContainer'

export interface IListData {
    entityStructure: CiType | undefined
    columnListData: IColumn | undefined
    unitsData: EnumType | undefined
    constraintsData: (EnumType | undefined)[]
    tableData: void | ConfigurationItemSetUi | undefined
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
        <AttributesContainer
            entityName={entityName ?? ''}
            View={({ data: { constraintsData, unitsData, ciTypeData } }) => {
                return (
                    <CiListContainer
                        entityName={entityName ?? ''}
                        ListComponent={({ data: { columnListData, tableData }, filterCallbacks, filter }) => (
                            <>
                                {/* 
            Filter
            Actions
            */}
                                <CiTable
                                    data={{ columnListData, tableData, constraintsData, unitsData, entityStructure: ciTypeData }}
                                    filterCallbacks={filterCallbacks}
                                    filter={filter}
                                />
                            </>
                        )}
                    />
                )
            }}
        />
    )
}

export default ProjektListPage
