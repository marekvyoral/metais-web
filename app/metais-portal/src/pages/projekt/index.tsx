import React from 'react'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'

import { CiListContainer } from '@/components/containers/CiListContainer'
import { CiTable } from '@/components/ci-table/CiTable'

interface ProjektFilterData extends IFilterParams {
    Gen_Profil_nazov?: string
    Gen_Profil_kod_metais?: string
}
const ProjektListPage: React.FC = () => {
    return (
        <CiListContainer<ProjektFilterData>
            defaultFilterValues={{}}
            entityName="Projekt"
            ListComponent={({ data, handleFilterChange, pagination, sort }) => (
                <>
                    <CiTable data={data} handleFilterChange={handleFilterChange} pagination={pagination} sort={sort} />
                </>
            )}
        />
    )
}

export default ProjektListPage
