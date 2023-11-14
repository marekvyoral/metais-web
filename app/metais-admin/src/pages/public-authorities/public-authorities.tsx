import React from 'react'
import { useTranslation } from 'react-i18next'

import { TodoPage } from '@/components/views/todo-page/TodoPage'

const PublicAuthoritiesPage = () => {
    const { t } = useTranslation()
    return <TodoPage heading={t('publicAuthorities.heading')} />
}

export default PublicAuthoritiesPage
