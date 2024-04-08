import { Identity, RoleOrgIdentity } from '@isdd/metais-common/api/generated/iam-swagger'
import { TaskHistory, useCloseTask, useGetTaskById, useReassignTask } from '@isdd/metais-common/api/generated/tasks-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { ColumnDef } from '@tanstack/react-table'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'

import { getGidsForUserOrgRoles, getGidsForUserRoles } from '@/componentHelpers/tasks/tasks.helpers'
import { TaskDetailView } from '@/components/views/tasks/TaskDetailView'

enum ActivityType {
    TASK_CREATE = 'Novo vytvorená úloha',
    CLOSE_TASK = 'Uzatvorenie úlohy',
    USER_CHANGED = 'Zmena používatela',
}

interface ITaskDetailContainer {
    taskId: string | undefined
}

export const TaskDetailContainer: React.FC<ITaskDetailContainer> = ({ taskId }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const historyColumns: ColumnDef<TaskHistory>[] = [
        {
            id: 'activity',
            header: t('tasks.tableHeaders.action'),
            accessorKey: 'activity',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
        },
        {
            id: 'assignedTo',
            header: t('tasks.tableHeaders.assignedTo'),
            accessorKey: 'assignedTo',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
        },
        {
            id: 'changedAt',
            header: t('tasks.tableHeaders.changedAt'),
            accessorKey: 'changedAt',
            cell: (row) => {
                return <span>{t('dateTime', { date: row.getValue() })}</span>
            },
        },
        {
            id: 'changedBy',
            header: t('tasks.tableHeaders.changedBy'),
            accessorKey: 'changedBy',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
        },
    ]
    const [selectedLogin, setSelectedLogin] = useState<Identity | undefined>(undefined)
    const [selectedGroup, setSelectedGroup] = useState<RoleOrgIdentity | undefined>(undefined)

    const { isLoading, isError, data: task, refetch: refetchTask } = useGetTaskById({ id: parseInt(taskId ?? '') ?? '' })
    const { setIsActionSuccess } = useActionSuccess()
    const navigate = useNavigate()
    const location = useLocation()
    const closeTaskCall = useCloseTask()
    const reassignTaskCall = useReassignTask()

    const closeTask = () => {
        closeTaskCall.mutate(
            {
                data: {
                    activity: ActivityType.CLOSE_TASK,
                    changedBy: user?.login,
                    id: task?.id,
                },
            },
            {
                onSuccess: async () => {
                    setIsActionSuccess({ value: true, path: `${RouterRoutes.TASKS}`, additionalInfo: { type: 'edit' } })
                    navigate(`${RouterRoutes.TASKS}`, { state: { from: location } })
                    await refetchTask()
                },
            },
        )
    }

    const reassignTask = (assignToUser: boolean) => {
        reassignTaskCall.mutate(
            {
                data: {
                    id: task?.id,
                    changedBy: user?.login,
                    assignedTo: assignToUser ? (selectedLogin ? selectedLogin?.login : user?.login) : selectedGroup?.orgName,
                    activity: ActivityType.USER_CHANGED,
                    assignedToIds: [user?.login || '', ...getGidsForUserOrgRoles(user), ...getGidsForUserRoles(user)],
                },
            },
            {
                onSuccess: async () => {
                    setIsActionSuccess({
                        value: true,
                        path: `${RouterRoutes.TASKS}/${taskId}`,
                        additionalInfo: {
                            type: assignToUser ? 'toUser' : 'toGroup',
                            userName:
                                (selectedLogin ? selectedLogin?.firstName + ' ' + selectedLogin?.lastName : user?.firstName + ' ' + user?.lastName) ??
                                '',
                            groupName: selectedGroup?.orgName ?? '',
                        },
                    })
                    await refetchTask()
                },
            },
        )
    }

    return (
        <TaskDetailView
            task={task}
            isLoading={isLoading}
            isError={isError}
            historyColumns={historyColumns}
            closeTask={closeTask}
            reassignTask={reassignTask}
            setSelectedLogin={setSelectedLogin}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
        />
    )
}
