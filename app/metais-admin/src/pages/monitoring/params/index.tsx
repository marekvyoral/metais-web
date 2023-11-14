import React from 'react'
import { useTranslation } from 'react-i18next'

import { TodoPage } from '@/components/views/todo-page/TodoPage'

const MonitoringParams = () => {
    const { t } = useTranslation()
    return <TodoPage heading={t('monitoring.params.heading')} />
}

export default MonitoringParams
