import React from 'react'

import { RelationListContainer } from '@/components/containers/Egov/Relation/RelationsListContainer'
import { EgovTable } from '@/components/table/EgovTable'

const Relation = () => {
    return (
        <RelationListContainer
            View={(props) => {
                return <EgovTable data={props?.data?.results} entityName={'relation'} />
            }}
        />
    )
}

export default Relation
