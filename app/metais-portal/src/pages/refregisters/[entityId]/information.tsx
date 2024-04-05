import { REFERENCE_REGISTER } from '@isdd/metais-common/constants'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { useParams } from 'react-router-dom'
import { transformAttributes } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { useMemo } from 'react'

import { RefRegisterView } from '@/components/views/refregisters/RefRegisterView'
import { useRefRegisterHook } from '@/hooks/useRefRegister.hook'

const RefRegistersInformation = () => {
    const { entityId } = useParams()
    const entityName = REFERENCE_REGISTER

    const { ciTypeData, isLoading: isAttributesLoading, isError: isAttributesError } = useAttributesHook(entityName)
    const { referenceRegisterData, guiAttributes, isLoading: isRefLoading, isError: isRefError } = useRefRegisterHook(entityId)

    const isLoading = [isAttributesLoading, isRefLoading].some((item) => item)
    const isError = [isAttributesError, isRefError].some((item) => item)

    const transformedAttributes = useMemo(
        () => transformAttributes([...(ciTypeData?.attributes ?? []), ...(guiAttributes ?? [])]),
        [ciTypeData?.attributes, guiAttributes],
    )
    return (
        <>
            <RefRegisterView
                isLoading={isLoading}
                isError={isError}
                data={{
                    referenceRegisterData: referenceRegisterData,
                    renamedAttributes: transformedAttributes,
                }}
            />
        </>
    )
}

export default RefRegistersInformation
