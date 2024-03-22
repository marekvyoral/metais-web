import { TextHeading, useTabbing } from '@isdd/idsk-ui-kit/index'
import React, { useId, useRef, useState } from 'react'
import { PopupActions } from 'reactjs-popup/dist/types'
import { useTranslation } from 'react-i18next'
import { Popup } from 'reactjs-popup'
import { Link, useLocation } from 'react-router-dom'
import { FactCheckIcon, FactCheckBlackIcon } from '@isdd/metais-common/assets/images'
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
    const contentRef = useRef(null)
    const triggerId = useId()
    const [isExpanded, setIsExpanded] = useState<boolean>(false)

    const assignedTo = [user?.login ?? '', ...getGidsForUserOrgRoles(user), ...getUuidsForUserOrgRoles(user)]
    const { data: tasks } = useGetTasksWithRefresh({ assignedTo: assignedTo && assignedTo.length > 0 ? [...new Set(assignedTo)] : [] })

    const youHaveCountTitle = t('tasks.youHaveTasks', { numberOfTasks: (tasks?.tasksCountCreated ?? 0) + (tasks?.tasksCountInProgress ?? 0) })

    const popupRef = useRef<PopupActions>(null)
    const popupTrigger = (
        <IconWithNotification
            id={triggerId}
            title={t('tasks.tasks')}
            iconActive={FactCheckBlackIcon}
            iconInactive={FactCheckIcon}
            count={(tasks?.tasksCountCreated ?? 0) + (tasks?.tasksCountInProgress ?? 0)}
            path=""
            showAsLink={false}
            altText={t('tasks.tasks')}
            ariaLabel={youHaveCountTitle}
            className={styles.tasksPopupBtn}
        />
    )

    useTabbing(contentRef, isExpanded)

    return (
        <Popup
            trigger={popupTrigger}
            arrow={false}
            ref={popupRef}
            position="bottom right"
            onOpen={() => {
                setIsExpanded(true)
            }}
            onClose={() => {
                setIsExpanded(false)
                document.getElementById(triggerId)?.focus()
            }}
        >
            <div className={styles.tasksPopupContent} ref={contentRef}>
                <TextHeading size="S">{youHaveCountTitle}</TextHeading>
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
