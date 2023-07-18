import React from 'react'
import { useParams } from 'react-router-dom'

import { CiContainer } from '@/components/containers/CiContainer'
import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { CiInformationAccordion } from '@/components/entities/accordion/CiInformationAccordion'
import { RelationsListContainer } from '@/components/containers/RelationsListContainer'
import { NeighboursCardList } from '@/components/entities/NeighboursCardList'

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
                                return <CiInformationAccordion data={{ ciItemData, constraintsData, ciTypeData, unitsData }} />
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
