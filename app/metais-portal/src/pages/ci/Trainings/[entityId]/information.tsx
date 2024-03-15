import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'
import { useMemo } from 'react'
import { useGetRoleParticipant } from '@isdd/metais-common/api/generated/cmdb-swagger'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { CI_TYPE_DATA_TRAINING_BLACK_LIST, getModifiedCiTypeData } from '@/componentHelpers/ci/ciTypeBlackList'
import { CiTrainingInformationView } from '@/components/views/trainings/CiTrainingInformationView'

const TrainingInformation = () => {
    const { entityId, entityName } = useGetEntityParamsFromUrl()

    const { ciItemData, gestorData, isLoading: isCiItemLoading, isError: isCiItemError } = useCiHook(entityId)
    const { constraintsData, ciTypeData, unitsData, isLoading: isAttLoading, isError: isAttError } = useAttributesHook(entityName)

    const {
        data: roleParticipant,
        isLoading: roleParticipantLoading,
        isError: roleParticipantIsError,
    } = useGetRoleParticipant(ciItemData?.metaAttributes?.owner ?? '', { query: { enabled: !!ciItemData } })

    const ciTypeModified = useMemo(() => {
        return getModifiedCiTypeData(ciTypeData, CI_TYPE_DATA_TRAINING_BLACK_LIST)
    }, [ciTypeData])

    return (
        <CiTrainingInformationView
            data={{ ciItemData, gestorData, constraintsData, ciTypeData: ciTypeModified, unitsData, roleParticipant }}
            isError={[isCiItemError, isAttError, roleParticipantIsError].some((item) => item)}
            isLoading={[isCiItemLoading, isAttLoading, roleParticipantLoading].some((item) => item)}
        />
    )
}

export default TrainingInformation
