import React from 'react'
import { useParams } from 'react-router-dom'

import { RelationshipsAccordionContainer } from '@/components/containers/RelationshipsContainer'
import { RelationshipsAccordion } from '@/components/views/relationships/RelationshipsAccordion'

const RelationshipsAccordionPage: React.FC = () => {
    const { entityId } = useParams()

    return (
        <RelationshipsAccordionContainer
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
