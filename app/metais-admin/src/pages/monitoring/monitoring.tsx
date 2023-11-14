import React from 'react'
import { useTranslation } from 'react-i18next'

import { TodoPage } from '@/components/views/todo-page/TodoPage'

const MonitoringPage = () => {
    const { t } = useTranslation()
    return <TodoPage heading={t('monitoring.heading')} />
}

export default MonitoringPage
