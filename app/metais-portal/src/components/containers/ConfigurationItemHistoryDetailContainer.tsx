import { useGetRoleParticipant } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'
import React from 'react'

import { ConfigurationItemHistoryDetailView } from '@/components/views/history/ConfigurationItemHistoryDetailView'

interface ConfigurationItemHistoryDetail {
    configurationItemId: string
}

export const ConfigurationItemHistoryDetailContainer: React.FC<ConfigurationItemHistoryDetail> = ({ configurationItemId }) => {
    const { ciItemData, isLoading: isCiItemLoading, isError: isCiItemError } = useCiHook(configurationItemId)

    const {
        data: roleParticipant,
        isLoading: roleParticipantLoading,
        isError: roleParticipantIsError,
    } = useGetRoleParticipant(ciItemData?.metaAttributes?.owner ?? '', { query: { enabled: !!ciItemData } })

    const isLoading = [roleParticipantLoading, isCiItemLoading].some((item) => item)
    const isError = [roleParticipantIsError, isCiItemError].some((item) => item)

    return (
        <ConfigurationItemHistoryDetailView
            data={ciItemData}
            roleParticipant={roleParticipant}
            isLoading={roleParticipantLoading || isLoading}
            isError={roleParticipantIsError || isError}
        />
    )
}
