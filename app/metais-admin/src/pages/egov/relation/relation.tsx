import { EntityFilterData } from '@isdd/metais-common/componentHelpers/filter/feFilters'

import { RelationListContainer } from '@/components/containers/Egov/Relation/RelationsListContainer'
import { EntityFilter } from '@/components/filters/EntityFilter'
import { EgovTable } from '@/components/table/EgovTable'

const Relation = () => {
    const defaultFilterValues: EntityFilterData = { name: '', technicalName: '', type: '', valid: '' }

    return (
        <RelationListContainer
            defaultFilterValues={defaultFilterValues}
            View={(props) => {
                return (
                    <>
                        <EntityFilter defaultFilterValues={defaultFilterValues} />
                        <EgovTable data={props?.data} entityName={'relation'} />
                    </>
                )
            }}
        />
    )
}

export default Relation
