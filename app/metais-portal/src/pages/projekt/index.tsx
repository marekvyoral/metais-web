import React from 'react'

import { CiListContainer } from '@/components/containers/CiListContainer'
import { CiTable } from '@/components/ci-table/CiTable'

const ProjektListPage: React.FC = () => {
    return (
        <CiListContainer
            entityName="Projekt"
            ListComponent={({ data, handleFilterChange, pagination }) => (
                <>
                    {/* 
            ProjektFilter
            ProjektActions
            */}
                    <CiTable data={data} handleFilterChange={handleFilterChange} pagination={pagination} />
                </>
            )}
        />
    )
}

export default ProjektListPage
