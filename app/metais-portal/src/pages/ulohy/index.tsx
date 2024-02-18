import React from 'react'
import { useTranslation } from 'react-i18next'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { TasksListContainer } from '@/components/containers/tasks/TasksListContainer'

const TasksPage: React.FC = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.myTasks')} ${META_IS_TITLE}`
    return <TasksListContainer />
}

export default TasksPage
