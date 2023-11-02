import { TextWarning } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { HistoryAccordion } from '@/components/views/history/HistoryAccordeon'

const History: React.FC = () => {
    const { t } = useTranslation()
    const { entityId } = useParams()

    return entityId ? <HistoryAccordion entityId={entityId} /> : <TextWarning>{t('errors.invalidEntityId')}</TextWarning>
}

export default History