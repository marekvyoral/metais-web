import { useParams } from 'react-router-dom'
import { AttributesContainer } from '@isdd/metais-common/components/containers/AttributesContainer'
import { REFERENCE_REGISTER } from '@isdd/metais-common/constants'

import { RefRegisterContainer } from '@/components/containers/refregisters/RefRegisterContainer'
import { RefRegisterView } from '@/components/views/refregisters/RefRegisterView'

const RefRegistersInformation = () => {
    const { entityId } = useParams()
    const entityName = REFERENCE_REGISTER

    return (
        <>
            <AttributesContainer
                entityName={entityName}
                View={(attributesProps) => (
                    <RefRegisterContainer
                        entityId={entityId ?? ''}
                        View={(props) => (
                            <RefRegisterView
                                isLoading={props.isLoading}
                                isError={props?.isError}
                                data={{
                                    referenceRegisterData: props?.data?.referenceRegisterData,
                                    attributesProps: {
                                        ...attributesProps,
                                        data: {
                                            ...attributesProps?.data,
                                            renamedAttributes: [
                                                ...(attributesProps?.data?.renamedAttributes ?? []),
                                                ...(props?.data?.guiAttributes ?? []),
                                            ],
                                        },
                                    },
                                }}
                            />
                        )}
                    />
                )}
            />
        </>
    )
}

export default RefRegistersInformation
