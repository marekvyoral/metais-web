import React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { TaskDetailContainer } from '@/components/containers/tasks/TaskDetailContainer'

const TaskDetailPage: React.FC = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.taskDetail')} | MetaIS`
    const { taskId } = useParams()

    return <TaskDetailContainer taskId={taskId} />
}

export default TaskDetailPage
