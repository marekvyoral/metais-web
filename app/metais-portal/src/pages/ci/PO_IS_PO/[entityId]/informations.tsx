import React from 'react'
import { useParams } from 'react-router-dom'

import { CiContainer } from '@/components/containers/CiContainer'
import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { CiInformationAccordion } from '@/components/entities/accordion/CiInformationAccordion'

const Informations = () => {
    const { entityId } = useParams()
    const entityName = 'PO'

    return (
        <CiContainer
            configurationItemId={entityId ?? ''}
            View={({ data, isError: isCiItemError, isLoading: isCiItemLoading }) => {
                const ciItemData = data?.ciItemData
                const gestorData = data?.gestorData
                return (
                    <AttributesContainer
                        entityName={entityName ?? ''}
                        View={({ data: { ciTypeData, constraintsData, unitsData }, isError: isAttError, isLoading: isAttLoading }) => {
                            return (
                                <CiInformationAccordion
                                    data={{ ciItemData, gestorData, constraintsData, ciTypeData, unitsData }}
                                    isError={[isAttError, isCiItemError].some((item) => item)}
                                    isLoading={[isAttLoading, isCiItemLoading].some((item) => item)}
                                />
                            )
                        }}
                    />
                )
            }}
        />
    )
}

export default Informations
