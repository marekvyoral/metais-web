import { EntityFilterData } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import React from 'react'

import { EntityListContainer } from '@/components/containers/Egov/Entity/EntityListContainer'
import { EntityFilter } from '@/components/filters/EntityFilter'
import { EgovTable } from '@/components/table/EgovTable'

const Entity: React.FC = () => {
    const defaultFilterValues: EntityFilterData = { name: '', technicalName: '', type: '', valid: '' }

    return (
        <EntityListContainer
            defaultFilterValues={defaultFilterValues}
            View={(props) => {
                return (
                    <>
                        <EntityFilter defaultFilterValues={defaultFilterValues} />
                        <EgovTable data={props?.data} entityName={'entity'} />
                    </>
                )
            }}
        />
    )
}

export default Entity
