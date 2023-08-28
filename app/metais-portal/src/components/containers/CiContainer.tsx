import React from 'react'
import { QueryFeedback } from '@isdd/metais-common/index'
import { useTranslation } from 'react-i18next'
import { ConfigurationItemUi, RoleParticipantUI, useGetRoleParticipantBulk, useReadConfigurationItem } from '@isdd/metais-common/api'

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
    const { t } = useTranslation()
    const {
        data: ciItemData,
        isLoading,
        isError,
    } = useReadConfigurationItem(configurationItemId ?? '', {
        query: {
            queryKey: ['ciItemData', configurationItemId],
        },
    })

    const {
        data: gestorData,
        isLoading: isGestorLoading,
        isError: isGestorError,
    } = useGetRoleParticipantBulk({ gids: [ciItemData?.metaAttributes?.owner ?? ''] }, { query: { enabled: !!ciItemData } })

    if (!configurationItemId) return <View isLoading={false} isError />
    if (isLoading || isError || isGestorLoading || isGestorError) {
        return (
            <QueryFeedback
                loading={isLoading || isGestorLoading}
                error={isError || isGestorError}
                errorProps={{ errorMessage: t('feedback.failedFetch') }}
            />
        )
    }
    return <View data={{ ciItemData, gestorData }} isLoading={isLoading} isError={isError} />
}
