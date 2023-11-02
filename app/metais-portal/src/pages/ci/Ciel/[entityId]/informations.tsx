import React from 'react'
import { useParams } from 'react-router-dom'
import { AttributesContainer } from '@isdd/metais-common/components/containers/AttributesContainer'
import { ENITTY_CIEL } from '@isdd/metais-common/constants'

import { CiContainer } from '@/components/containers/CiContainer'
import { CiInformationAccordion } from '@/components/entities/accordion/CiInformationAccordion'

const Informations = () => {
    const { entityId } = useParams()

    const entityName = ENITTY_CIEL
    return (
        <>
            <CiContainer
                configurationItemId={entityId ?? ''}
                View={({ data, isError: isCiItemError, isLoading: isCiItemLoading }) => {
                    const ciItemData = data?.ciItemData
                    const gestorData = data?.gestorData
                    return (
                        <>
                            <AttributesContainer
                                entityName={entityName ?? ''}
                                View={({ data: { ciTypeData, constraintsData, unitsData }, isError: attError, isLoading: attLoading }) => {
                                    return (
                                        <CiInformationAccordion
                                            data={{ ciItemData, gestorData, constraintsData, ciTypeData, unitsData }}
                                            isError={[isCiItemError, attError].some((item) => item)}
                                            isLoading={[isCiItemLoading, attLoading].some((item) => item)}
                                        />
                                    )
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
