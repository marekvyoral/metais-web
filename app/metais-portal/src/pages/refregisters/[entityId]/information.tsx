import { REFERENCE_REGISTER } from '@isdd/metais-common/constants'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { useParams } from 'react-router-dom'

import { RefRegisterView } from '@/components/views/refregisters/RefRegisterView'
import { useRefRegisterHook } from '@/hooks/useRefRegister.hook'

const RefRegistersInformation = () => {
    const { entityId } = useParams()
    const entityName = REFERENCE_REGISTER

    const { renamedAttributes, isLoading: isAttributesLoading, isError: isAttributesError } = useAttributesHook(entityName)
    const { referenceRegisterData, guiAttributes, isLoading: isRefLoading, isError: isRefError } = useRefRegisterHook(entityId)

    const isLoading = [isAttributesLoading, isRefLoading].some((item) => item)
    const isError = [isAttributesError, isRefError].some((item) => item)

    return (
        <>
            <RefRegisterView
                isLoading={isLoading}
                isError={isError}
                data={{
                    referenceRegisterData: referenceRegisterData,
                    renamedAttributes: [...(renamedAttributes ?? []), ...(guiAttributes ?? [])],
                }}
            />
        </>
    )
}

export default RefRegistersInformation
