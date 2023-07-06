import React from 'react'
import { useParams } from 'react-router-dom'

import { CiListContainer } from '@/components/containers/CiListContainer'
import { CiTable } from '@/components/ci-table/CiTable'
import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { ActionsOverTable } from '@/components/actions-over-table/ActionsOverTable'
import { DEFAULT_PAGESIZE_OPTIONS } from '@/components/constants'

const ProjektListPage = () => {
    const { entityName } = useParams()

    return (
        <AttributesContainer
            entityName={entityName ?? ''}
            View={({ data: { constraintsData, unitsData, ciTypeData } }) => {
                return (
                    <CiListContainer
                        entityName={entityName ?? ''}
                        ListComponent={({ data: { columnListData, tableData }, handleFilterChange, pagination, sort }) => (
                            <>
                                {/* 
            Filter
            Actions
            */}
                                <ActionsOverTable
                                    handleFilterChange={handleFilterChange}
                                    pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                                    //storeUserSelectedColumns={storeUserSelectedColumns}
                                    // resetUserSelectedColumns={resetUserSelectedColumns}
                                    //  pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                                    entityName={entityName ?? ''}
                                />
                                <CiTable
                                    data={{ columnListData, tableData, constraintsData, unitsData, entityStructure: ciTypeData }}
                                    handleFilterChange={handleFilterChange}
                                    pagination={pagination}
                                    sort={sort}
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
