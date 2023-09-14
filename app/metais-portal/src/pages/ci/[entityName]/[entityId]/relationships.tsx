import React from 'react'
import { useParams } from 'react-router-dom'

import { RelationshipsAccordion } from '@/components/views/relationships/RelationshipsAccordion'
import { CiContainer } from '@/components/containers/CiContainer'

const RelationshipsAccordionPage: React.FC = () => {
    const { entityId } = useParams()

    return (
        <CiContainer
            configurationItemId={entityId}
            View={(props) => {
                return (
                    <RelationshipsAccordion
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
