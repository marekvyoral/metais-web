import { useCiHook } from './useCi.hook'

import { ConfigurationItemUi, RoleParticipantUI } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ApiSlaContractRead, useGetSlaContract } from '@isdd/metais-common/api/generated/monitoring-swagger'

export type SlaContractDetailReturnType = {
    slaContractData: ApiSlaContractRead | undefined
    ciItemData: ConfigurationItemUi | undefined
    gestorData: RoleParticipantUI[] | undefined
    isLoading: boolean
    isError: boolean
}

export const useSlaContractDetail = (entityId: string): SlaContractDetailReturnType => {
    const { data: slaContractData, isLoading: isSlaContractLoading, isError: isSlaContractError } = useGetSlaContract(entityId ?? '')
    const { ciItemData, gestorData, isLoading: isCiItemLoading, isError: isCiItemError } = useCiHook(entityId)

    const isLoading = [isSlaContractLoading, isCiItemLoading].some((item) => item)

    const isError = [isSlaContractError, isCiItemError].some((item) => item)

    return {
        isLoading,
        isError,
        slaContractData,
        ciItemData,
        gestorData,
    } as const
}
