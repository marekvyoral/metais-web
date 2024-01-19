import React from 'react'
import { TextWarning } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'

import { HistoryAccordion } from '@/components/views/history/HistoryAccordeon'
import { CiHistoryPermissionsWrapper } from '@/components/permissions/CiHistoryPermissionsWrapper'
import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

export const SlaContractHistory: React.FC = () => {
    const { t } = useTranslation()
    const { entityId, entityName } = useGetEntityParamsFromUrl()
    return entityId ? (
        <CiHistoryPermissionsWrapper entityId={entityId ?? ''} entityName={entityName ?? ''}>
            <HistoryAccordion entityId={entityId} />
        </CiHistoryPermissionsWrapper>
    ) : (
        <TextWarning>{t('errors.invalidEntityId')}</TextWarning>
    )
}
