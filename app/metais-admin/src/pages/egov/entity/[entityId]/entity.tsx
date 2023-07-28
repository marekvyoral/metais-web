import React from 'react'
import { useParams } from 'react-router-dom'

import { EntityDetailContainer } from '@/components/containers/Egov/Entity/EntityDetailContainer'
import { EntityDetailView } from '@/components/views/egov/entity-detail-views/EntityDetailView'

const Entity = () => {
    const { entityId } = useParams()
    return (
        <EntityDetailContainer
            entityName={entityId ?? ''}
            View={(props) => (
                <EntityDetailView
                    data={props?.data}
                    setValidityOfEntity={props?.setValidityOfEntity}
                    setSummarizingCardData={props?.setSummarizingCardData}
                    saveExistingAttribute={props?.saveExistingAttribute}
                    resetExistingAttribute={props?.resetExistingAttribute}
                />
            )}
        />
    )
}

export default Entity
