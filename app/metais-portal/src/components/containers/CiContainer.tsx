import React from 'react'
import { QueryFeedback } from '@isdd/metais-common/index'
import { useTranslation } from 'react-i18next'
import { ConfigurationItemUi, useReadConfigurationItem } from '@isdd/metais-common/api'

export interface ICiContainerView {
    data?: ConfigurationItemUi
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

    if (!configurationItemId) return <View isLoading={false} isError />
    if (isLoading || isError) {
        return <QueryFeedback loading={isLoading} error={isError} errorProps={{ errorMessage: t('feedback.failedFetch') }} />
    }
    return <View data={ciItemData} isLoading={isLoading} isError={isError} />
}
