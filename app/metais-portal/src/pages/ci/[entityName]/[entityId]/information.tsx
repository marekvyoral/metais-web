import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { CiInformationAccordion } from '@/components/entities/accordion/CiInformationAccordion'

const Information = () => {
    const { entityId, entityName } = useGetEntityParamsFromUrl()

    const { ciItemData, gestorData, isLoading: isCiItemLoading, isError: isCiItemError } = useCiHook(entityId)
    const { constraintsData, ciTypeData, unitsData, isLoading: isAttLoading, isError: isAttError } = useAttributesHook(entityName)
    return (
        <>
            <CiInformationAccordion
                data={{ ciItemData, gestorData, constraintsData, ciTypeData, unitsData }}
                isError={[isCiItemError, isAttError].some((item) => item)}
                isLoading={[isCiItemLoading, isAttLoading].some((item) => item)}
            />
        </>
    )
}

export default Information
