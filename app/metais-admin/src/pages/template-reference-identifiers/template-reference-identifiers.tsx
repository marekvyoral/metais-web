import React from 'react'
import { useTranslation } from 'react-i18next'

import { TodoPage } from '@/components/views/todo-page/TodoPage'

const TemplateReferenceIdentifiersPage = () => {
    const { t } = useTranslation()
    return <TodoPage heading={t('templateReferenceIdentifiers.heading')} />
}

export default TemplateReferenceIdentifiersPage
