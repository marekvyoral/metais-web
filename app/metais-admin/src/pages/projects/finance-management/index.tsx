import React from 'react'
import { useTranslation } from 'react-i18next'

import { TodoPage } from '@/components/views/todo-page/TodoPage'

const FinanceManagement = () => {
    const { t } = useTranslation()
    return <TodoPage heading={t('projects.financeManagement.heading')} />
}

export default FinanceManagement
