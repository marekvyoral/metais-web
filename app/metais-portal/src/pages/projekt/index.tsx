import React from 'react'

import { CiListContainer } from '@/components/containers/CiListContainer'
import { CiTable } from '@/components/ci-table/CiTable'

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
