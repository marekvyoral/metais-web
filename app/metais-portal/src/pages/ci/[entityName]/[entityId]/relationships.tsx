import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'
import React from 'react'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { RelationshipsAccordion } from '@/components/views/relationships/RelationshipsAccordion'

const RelationshipsAccordionPage: React.FC = () => {
    const { entityId, entityName } = useGetEntityParamsFromUrl()

    const { ciItemData, isLoading: isCiItemLoading, isError: isCiItemError } = useCiHook(entityId)
    return (
        <RelationshipsAccordion
            entityName={entityName ?? ''}
            data={ciItemData}
            configurationItemId={entityId}
            isError={isCiItemError}
            isLoading={isCiItemLoading}
        />
    )
}

export default RelationshipsAccordionPage
