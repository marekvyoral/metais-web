import React from 'react'
import { PO } from '@isdd/metais-common/constants'

import { RelationshipsAccordion } from '@/components/views/relationships/RelationshipsAccordion'
import { CiContainer } from '@/components/containers/CiContainer'
import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

const PORelationshipOutlet: React.FC = () => {
    const { entityId } = useGetEntityParamsFromUrl()
    const entityName = PO
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

export default PORelationshipOutlet
