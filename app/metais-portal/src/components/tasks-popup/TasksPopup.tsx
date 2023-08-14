import { Button, TextHeading } from '@isdd/idsk-ui-kit/index'
import React, { useEffect, useRef } from 'react'
import { PopupActions } from 'reactjs-popup/dist/types'
import { useTranslation } from 'react-i18next'
import { Popup } from 'reactjs-popup'
import { Link } from 'react-router-dom'
import { FactCheckIcon } from '@isdd/metais-common/assets/images'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useGetTasks, TaskState } from '@isdd/metais-common/api/generated/tasks-swagger'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { IconWithNotification } from '@isdd/metais-common/components/navbar/navbar-main/IconWithNotification'

import styles from './TasksPopup.module.scss'

import { getGidsForUserOrgRoles, getUuidsForUserOrgRoles } from '@/componentHelpers/tasks/tasks.helpers'

export const TasksPopup: React.FC = () => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()

    const { data: tasks, mutate } = useGetTasks()
    useEffect(() => {
        if (user) {
            const assignedTo = [user.login, ...getGidsForUserOrgRoles(user), ...getUuidsForUserOrgRoles(user)]
            mutate({
                data: {
                    assignedTo: [...new Set(assignedTo)],
                    sortBy: 'id',
                    perPage: 10,
                    pageNumber: 1,
                    ascending: false,
                    states: [TaskState.CREATED, TaskState.IN_PROGRESS],
                },
            })
        }
    }, [user, mutate])

    const popupRef = useRef<PopupActions>(null)
    const popupTrigger = (
        <Button
            label={
                <IconWithNotification
                    onClick={() => undefined}
                    title={t('tasks.tasks')}
                    src={FactCheckIcon}
                    count={(tasks?.tasksCountCreated ?? 0) + (tasks?.tasksCountInProgress ?? 0)}
                    path=""
                />
            }
            className={styles.tasksPopupBtn}
        />
    )

    return (
        <Popup trigger={popupTrigger} arrow={false} keepTooltipInside ref={popupRef} position="bottom right" className={styles['task-popup']}>
            <div className={styles.tasksPopupContent}>
                <TextHeading size="S">
                    {t('tasks.youHaveTasks', { numberOfTasks: (tasks?.tasksCountCreated ?? 0) + (tasks?.tasksCountInProgress ?? 0) })}
                </TextHeading>
                <ul className={styles.tasksList}>
                    {tasks?.tasks?.map((task) => {
                        return (
                            <li key={task.id}>
                                <Link to={`${RouteNames.TASKS}/${task.id}`} onClick={() => popupRef.current?.close()}>
                                    {task.name}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
                <Link to={`${RouteNames.TASKS}`} onClick={() => popupRef.current?.close()}>
                    {t('tasks.showAll')}
                </Link>
            </div>
        </Popup>
    )
}
