import React from 'react'
import { ConfigurationItemUi, useGetRoleParticipant } from '@isdd/metais-common/api/generated/cmdb-swagger'

import { ConfigurationItemHistoryDetailView } from '../views/history/ConfigurationItemHistoryDetailView'

interface ConfigurationItemHistoryDetail {
    data?: ConfigurationItemUi
    configurationItemId: string
    isLoading: boolean
    isError: boolean
}

export const ConfigurationItemHistoryDetailContainer: React.FC<ConfigurationItemHistoryDetail> = ({ data, isLoading, isError }) => {
    const {
        data: roleParticipant,
        isLoading: roleParticipantLoading,
        isError: roleParticipantIsError,
    } = useGetRoleParticipant(data?.metaAttributes?.owner ?? '')

    return (
        <ConfigurationItemHistoryDetailView
            data={data}
            roleParticipant={roleParticipant}
            isLoading={roleParticipantLoading || isLoading}
            isError={roleParticipantIsError || isError}
        />
    )
}
