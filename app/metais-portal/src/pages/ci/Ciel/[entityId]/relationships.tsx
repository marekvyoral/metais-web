import React from 'react'

import { RelationshipsAccordion } from '@/components/views/relationships/RelationshipsAccordion'
import { CiContainer } from '@/components/containers/CiContainer'
import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

const RelationshipsAccordionPage: React.FC = () => {
    const { entityId, entityName } = useGetEntityParamsFromUrl()

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
