import React from 'react'
import { useParams } from 'react-router-dom'

import { CiListContainer } from '@/components/containers/CiListContainer'
import { CiTable } from '@/components/ci-table/CiTable'
import { AttributesContainer } from '@/components/containers/AttributesContainer'

const ProjektListPage = () => {
    const { entityName } = useParams()

    return (
        <AttributesContainer
            entityName={entityName ?? ''}
            View={({ data: { constraintsData, unitsData, ciTypeData } }) => {
                return (
                    <CiListContainer
                        entityName={entityName ?? ''}
                        ListComponent={({ data: { columnListData, tableData }, handleFilterChange, pagination }) => (
                            <>
                                {/* 
            Filter
            Actions
            */}
                                <CiTable
                                    data={{ columnListData, tableData, constraintsData, unitsData, entityStructure: ciTypeData }}
                                    handleFilterChange={handleFilterChange}
                                    pagination={pagination}
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
