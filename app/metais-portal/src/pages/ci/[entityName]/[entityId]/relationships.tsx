import React from 'react'
import { useParams } from 'react-router-dom'
import { shouldEntityNameBePO } from '@isdd/metais-common/componentHelpers/ci/entityNameHelpers'

import { RelationshipsAccordion } from '@/components/views/relationships/RelationshipsAccordion'
import { CiContainer } from '@/components/containers/CiContainer'

const RelationshipsAccordionPage: React.FC = () => {
    const { entityId } = useParams()
    let { entityName } = useParams()
    entityName = shouldEntityNameBePO(entityName ?? '')
    return (
        <CiContainer
            configurationItemId={entityId}
            View={(props) => {
                return (
                    <RelationshipsAccordion
                        entityName={entityName ?? ''}
                        data={props?.data?.ciItemData}
                        configurationItemId={entityId}
                        isError={props.isError}
                        isLoading={props.isLoading}
                    />
                )
            }}
        />
    )
}

export default RelationshipsAccordionPage
