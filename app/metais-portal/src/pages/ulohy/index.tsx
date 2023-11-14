import React from 'react'
import { useTranslation } from 'react-i18next'

import { TasksListContainer } from '@/components/containers/tasks/TasksListContainer'

const TasksPage: React.FC = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.myTasks')} | MetaIS`
    return <TasksListContainer />
}

export default TasksPage
