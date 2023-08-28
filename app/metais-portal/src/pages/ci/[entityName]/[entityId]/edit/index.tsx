import { useParams } from 'react-router-dom'

import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { CiContainer } from '@/components/containers/CiContainer'
import { EditCiEntityView } from '@/components/views/ci/edit/EditCiEntityView'

const EditEntityPage = () => {
    const { entityName, entityId } = useParams()

    return (
        <>
            <CiContainer
                configurationItemId={entityId ?? ''}
                View={({ data: ciData }) => {
                    const ciItemData = ciData?.ciItemData
                    return (
                        <AttributesContainer
                            entityName={entityName ?? ''}
                            View={({ data: { ciTypeData, constraintsData, unitsData } }) => {
                                return (
                                    <EditCiEntityView
                                        ciTypeData={ciTypeData}
                                        constraintsData={constraintsData}
                                        unitsData={unitsData}
                                        ciItemData={ciItemData}
                                        entityId={entityId ?? ''}
                                        entityName={entityName ?? ''}
                                    />
                                )
                            }}
                        />
                    )
                }}
            />
        </>
    )
}

export default EditEntityPage
