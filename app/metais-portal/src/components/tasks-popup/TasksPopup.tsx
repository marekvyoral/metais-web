import { Button, TextHeading } from '@isdd/idsk-ui-kit/index'
import React, { useRef } from 'react'
import { PopupActions } from 'reactjs-popup/dist/types'
import { useTranslation } from 'react-i18next'
import { Popup } from 'reactjs-popup'
import { Link, useLocation } from 'react-router-dom'
import { FactCheckIcon } from '@isdd/metais-common/assets/images'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { Task } from '@isdd/metais-common/api/generated/tasks-swagger'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { IconWithNotification } from '@isdd/metais-common/components/navbar/navbar-main/IconWithNotification'
import { useGetTasksWithRefresh } from '@isdd/metais-common/hooks/useGetTasksWithRefresh'

import styles from './TasksPopup.module.scss'

import { getGidsForUserOrgRoles, getUuidsForUserOrgRoles } from '@/componentHelpers/tasks/tasks.helpers'

export const TasksPopup: React.FC = () => {
    const { t } = useTranslation()
    const location = useLocation()
    const {
        state: { user },
    } = useAuth()

    const assignedTo = [user?.login ?? '', ...getGidsForUserOrgRoles(user), ...getUuidsForUserOrgRoles(user)]
    const { data: tasks } = useGetTasksWithRefresh({ assignedTo: assignedTo && assignedTo.length > 0 ? [...new Set(assignedTo)] : [] })

    const popupRef = useRef<PopupActions>(null)
    const popupTrigger = (
        <Button
            label={
                <IconWithNotification
                    title={t('tasks.tasks')}
                    src={FactCheckIcon}
                    count={(tasks?.tasksCountCreated ?? 0) + (tasks?.tasksCountInProgress ?? 0)}
                    path=""
                    showAsLink={false}
                    altText={t('tasks.tasks')}
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
                    {tasks?.tasks?.map((task: Task) => {
                        return (
                            <li key={task.id}>
                                <Link to={`${RouteNames.TASKS}/${task.id}`} state={{ from: location }} onClick={() => popupRef.current?.close()}>
                                    {task.name}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
                <Link to={`${RouteNames.TASKS}`} state={{ from: location }} onClick={() => popupRef.current?.close()}>
                    {t('tasks.showAll')}
                </Link>
            </div>
        </Popup>
    )
}
