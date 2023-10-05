import { ConfigurationItemUi, RoleParticipantUI, useGetRoleParticipantBulk, useReadConfigurationItem } from '@isdd/metais-common/api'
import { CI_ITEM_QUERY_KEY } from '@isdd/metais-common/constants'
import React from 'react'

export interface ContainerViewData {
    ciItemData: ConfigurationItemUi
    gestorData: RoleParticipantUI[]
}

export interface ICiContainerView {
    data?: ContainerViewData
    isLoading: boolean
    isError: boolean
}
interface ICiContainer {
    configurationItemId?: string
    View: React.FC<ICiContainerView>
}

export const CiContainer: React.FC<ICiContainer> = ({ configurationItemId, View }) => {
    const {
        data: ciItemData,
        isLoading: isCiItemLoading,
        isError: isCiItemError,
    } = useReadConfigurationItem(configurationItemId ?? '', {
        query: {
            queryKey: [CI_ITEM_QUERY_KEY, configurationItemId],
        },
    })

    const {
        data: gestorData,
        isLoading: isGestorLoading,
        isError: isGestorError,
    } = useGetRoleParticipantBulk(
        { gids: [ciItemData?.metaAttributes?.owner ?? ''] },
        { query: { enabled: !!ciItemData, queryKey: ['roleParticipant', ciItemData?.metaAttributes?.owner ?? ''] } },
    )

    const isLoading = [isCiItemLoading, isGestorLoading].some((item) => item)
    const isError = [isCiItemError, isGestorError].some((item) => item)

    if (!configurationItemId) return <View isLoading={false} isError />

    if (isLoading || isError) return <View isLoading={isLoading} isError={isError} />
    if (!ciItemData || !gestorData) return <View isLoading={false} isError />

    return <View data={{ ciItemData, gestorData }} isLoading={isLoading} isError={isError} />
}
