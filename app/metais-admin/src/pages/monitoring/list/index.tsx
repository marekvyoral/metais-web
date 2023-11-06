import React from 'react'
import { useTranslation } from 'react-i18next'

import { TodoPage } from '@/components/views/todo-page/TodoPage'

const MonitoringList = () => {
    const { t } = useTranslation()
    return <TodoPage heading={t('monitoring.list.heading')} />
}

export default MonitoringList
