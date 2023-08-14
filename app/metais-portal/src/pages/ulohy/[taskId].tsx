import React from 'react'
import { useParams } from 'react-router-dom'

import { TaskDetailContainer } from '@/components/containers/tasks/TaskDetailContainer'

const TaskDetailPage: React.FC = () => {
    const { taskId } = useParams()

    return <TaskDetailContainer taskId={taskId} />
}

export default TaskDetailPage
