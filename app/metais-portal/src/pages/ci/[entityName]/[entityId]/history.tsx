import React from 'react'
import { useParams } from 'react-router-dom'
import { TextWarning } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'

import { HistoryAccordion } from '@/components/views/history/HistoryAccordeon'
import { CiHistoryPermissionsWrapper } from '@/components/permissions/CiHistoryPermissionsWrapper'

const History: React.FC = () => {
    const { t } = useTranslation()
    const { entityId, entityName } = useParams()

    return entityId ? (
        <CiHistoryPermissionsWrapper entityId={entityId ?? ''} entityName={entityName ?? ''}>
            <HistoryAccordion entityId={entityId} />
        </CiHistoryPermissionsWrapper>
    ) : (
        <TextWarning>{t('errors.invalidEntityId')}</TextWarning>
    )
}

export default History
