import React from 'react'

import { EntityListContainer } from '@/components/containers/Egov/Entity/EntityListContainer'
import { EgovTable } from '@/components/table/EgovTable'

const Entity: React.FC = () => {
    return (
        <EntityListContainer
            View={(props) => {
                return (
                    <>
                        <EgovTable data={props?.data?.results} entityName={'entity'} />
                    </>
                )
            }}
        />
    )
}

export default Entity
