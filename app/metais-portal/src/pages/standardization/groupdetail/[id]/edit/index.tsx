import { useParams } from 'react-router-dom'
import React from 'react'

import { KSIVSEditContainer } from '@/components/containers/KSIVSEditContainer'
import { KSIVSEditView } from '@/components/views/standartization/KSIVSEditView'

const KSIVSPageEdit = () => {
    const { id } = useParams()

    return (
        <KSIVSEditContainer id={id} View={(props) => <KSIVSEditView onSubmit={props.onSubmit} goBack={props.goBack} infoData={props.infoData} />} />
    )
}
export default KSIVSPageEdit
