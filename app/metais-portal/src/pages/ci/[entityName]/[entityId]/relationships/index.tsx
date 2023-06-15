import React from 'react'
import { useParams } from 'react-router-dom'

import { RelationshipsContainer } from '@/components/containers/RelationshipsContainer'
import { RelationshipsAccordion } from '@/components/views/relationships/RelationshipsAccordion'

const RelationshipsAccordionPage: React.FC = () => {
    const { entityId } = useParams()

    return (
        <RelationshipsContainer
            configurationItemId={entityId}
            View={(props) => {
                return (
                    <RelationshipsAccordion data={props?.data} isLoading={props.isLoading} isError={props.isError} configurationItemId={entityId} />
                )
            }}
        />
    )
}

export default RelationshipsAccordionPage
