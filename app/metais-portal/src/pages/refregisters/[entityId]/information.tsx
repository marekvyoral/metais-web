import { useParams } from 'react-router-dom'
import { AttributesContainer } from '@isdd/metais-common/components/containers/AttributesContainer'

import { RefRegisterContainer } from '@/components/containers/refregisters/RefRegisterContainer'
import { RefRegisterView } from '@/components/views/refregisters/RefRegisterView'

const Information = () => {
    const { entityId } = useParams()
    const entityName = 'ReferenceRegister'

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

export default Information
