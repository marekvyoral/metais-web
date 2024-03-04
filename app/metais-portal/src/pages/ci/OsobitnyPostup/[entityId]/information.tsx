import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'
import { useMemo } from 'react'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { CI_TYPE_DATA_ITVS_EXCEPTIONS_BLACK_LIST, getModifiedCiTypeData } from '@/componentHelpers/ci/ciTypeBlackList'
import { CiInformationAccordion } from '@/components/entities/accordion/CiInformationAccordion'

const ITVSExceptionsInformation = () => {
    const { entityId, entityName } = useGetEntityParamsFromUrl()

    const { ciItemData, gestorData, isLoading: isCiItemLoading, isError: isCiItemError } = useCiHook(entityId)
    const { constraintsData, ciTypeData, unitsData, isLoading: isAttLoading, isError: isAttError } = useAttributesHook(entityName)

    const ciTypeModified = useMemo(() => {
        return getModifiedCiTypeData(ciTypeData, CI_TYPE_DATA_ITVS_EXCEPTIONS_BLACK_LIST)
    }, [ciTypeData])

    return (
        <CiInformationAccordion
            data={{ ciItemData, gestorData, constraintsData, ciTypeData: ciTypeModified, unitsData }}
            isError={[isCiItemError, isAttError].some((item) => item)}
            isLoading={[isCiItemLoading, isAttLoading].some((item) => item)}
        />
    )
}

export default ITVSExceptionsInformation
