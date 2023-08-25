import React from 'react'
import { useParams } from 'react-router-dom'

import { CiContainer } from '@/components/containers/CiContainer'
import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { CiInformationAccordion } from '@/components/entities/accordion/CiInformationAccordion'

const Informations = () => {
    const { entityName, entityId } = useParams()

    return (
        <>
            <CiContainer
                configurationItemId={entityId ?? ''}
                View={({ data }) => {
                    const ciItemData = data?.ciItemData
                    const gestorData = data?.gestorData
                    return (
                        <>
                            <AttributesContainer
                                entityName={entityName ?? ''}
                                View={({ data: { ciTypeData, constraintsData, unitsData } }) => {
                                    return <CiInformationAccordion data={{ ciItemData, gestorData, constraintsData, ciTypeData, unitsData }} />
                                }}
                            />
                        </>
                    )
                }}
            />
        </>
    )
}

export default Informations
