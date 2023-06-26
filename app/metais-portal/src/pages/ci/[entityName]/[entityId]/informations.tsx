import React from 'react'
import { useParams } from 'react-router-dom'

import { CiContainer } from '@/components/containers/CiContainer'
import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { ProjectInformationAccordion } from '@/components/entities/projekt/accordion/ProjectInformationAccordion'
import { RelationsListContainer } from '@/components/containers/RelationsListContainer'
import { NeighboursCardList } from '@/components/entities/projekt/NeighboursCardList'

const Informations = () => {
    const { entityName, entityId } = useParams()

    return (
        <>
            <CiContainer
                configurationItemId={entityId ?? ''}
                View={({ data: ciItemData }) => {
                    return (
                        <AttributesContainer
                            entityName={entityName ?? ''}
                            View={({ data: { ciTypeData, constraintsData, unitsData } }) => {
                                return <ProjectInformationAccordion data={{ ciItemData, constraintsData, ciTypeData, unitsData }} />
                            }}
                        />
                    )
                }}
            />
            <RelationsListContainer entityId={entityId ?? ''} technicalName={entityName ?? ''} View={NeighboursCardList} />
        </>
    )
}

export default Informations
