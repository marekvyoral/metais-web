import React from 'react'
import { useParams } from 'react-router-dom'

import { CiContainer } from '@/components/containers/CiContainer'
import { ProjectInformationAccordion } from '@/components/entities/projekt/accordion/ProjectInformationAccordion'

const Informations = () => {
    const { entityName, entityId } = useParams()
    return <CiContainer entityName={entityName ?? ''} entityId={entityId ?? ''} View={ProjectInformationAccordion} />
}

export default Informations
