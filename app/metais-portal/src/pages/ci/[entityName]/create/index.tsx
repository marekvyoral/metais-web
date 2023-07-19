import React from 'react'
import { useParams } from 'react-router-dom'

import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { CreateEntity } from '@/components/create-entity/CreateEntity'
import { CiCreateEntityContainer } from '@/components/containers/CiCreateEntityContainer'

const CreateEntityPage: React.FC = () => {
    const { entityName } = useParams()

    return (
        <AttributesContainer
            entityName={entityName ?? ''}
            View={({ data: attributesData }) => (
                <CiCreateEntityContainer
                    entityName={entityName ?? ''}
                    View={({ data: ciListAndRolesData, filter, selectedOrgState, filterCallbacks }) => (
                        <CreateEntity
                            data={{ attributesData, ciListAndRolesData }}
                            filterCallbacks={filterCallbacks}
                            filter={filter}
                            selectedOrgState={selectedOrgState}
                            entityName={entityName ?? ''}
                        />
                    )}
                />
            )}
        />
    )
}

export default CreateEntityPage
