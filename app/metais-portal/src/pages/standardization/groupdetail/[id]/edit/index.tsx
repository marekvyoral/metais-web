import { useParams } from 'react-router-dom'
import React from 'react'

import { KSIVSEditContainer } from '@/components/containers/KSISVSEditContainer'
import { KSISVSEditView } from '@/components/views/standartization/KSISVSEditView'

const KSIVSPageEdit = () => {
    const { id } = useParams()

    return (
        <KSIVSEditContainer id={id} View={(props) => <KSISVSEditView onSubmit={props.onSubmit} goBack={props.goBack} infoData={props.infoData} />} />
    )
}
export default KSIVSPageEdit
