import React from 'react'
import { useParams } from 'react-router-dom'

import { EntityDetailContainer } from '@/components/containers/Egov/Entity/EntityDetailContainer'
import BasicInformations from '@/components/views/egov/BasicInformations'

const Entity = () => {
    const { entityId } = useParams()
    return (
        <EntityDetailContainer
            entityName={entityId ?? ''}
            View={({ data: { ciTypeData, constraintsData, unitsData } }) => {
                return <BasicInformations data={{ ciTypeData, constraintsData, unitsData }} />
            }}
        />
    )
}

export default Entity
