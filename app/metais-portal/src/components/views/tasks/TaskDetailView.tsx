import React, { SetStateAction } from 'react'
import { LoadingIndicator, BreadCrumbs, HomeIcon, TextHeading, Button, TextBody, Table, GridCol, GridRow } from '@isdd/idsk-ui-kit/index'
import { Identity, RoleOrgIdentity } from '@isdd/metais-common/api/generated/iam-swagger'
import { Task, TaskHistory, TaskState } from '@isdd/metais-common/api/generated/tasks-swagger'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'

import { AssignToUserSelect } from './AssignToUserSelect'
import { AssignToGroupSelect } from './AssignToGroupSelect'
import styles from './tasks.module.scss'

interface ITaskDetailView {
    task: Task | undefined
    historyColumns: ColumnDef<TaskHistory>[]
    isLoading: boolean
    isError: boolean
    closeTask: () => void
    reassignTask: (assignToUser: boolean) => void
    selectedLogin: Identity | undefined
    setSelectedLogin: React.Dispatch<SetStateAction<Identity | undefined>>
    selectedGroup: RoleOrgIdentity | undefined
    setSelectedGroup: React.Dispatch<SetStateAction<RoleOrgIdentity | undefined>>
}

export const TaskDetailView: React.FC<ITaskDetailView> = ({
    task,
    historyColumns,
    isLoading,
    isError,
    closeTask,
    reassignTask,
    selectedLogin,
    setSelectedLogin,
    selectedGroup,
    setSelectedGroup,
}) => {
    const { t } = useTranslation()

    return isLoading ? (
        <LoadingIndicator />
    ) : (
        <>
            <BreadCrumbs
                links={[
                    { label: t('tasks.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('tasks.tasks'), href: RouteNames.TASKS },
                    { label: `${task?.name}`, href: '' },
                ]}
            />
            <TextHeading size="L">{task?.name}</TextHeading>
            {task?.state !== TaskState.DONE ? (
                <>
                    <Button onClick={closeTask} label={t('tasks.finish')} className="idsk-button" />
                    <GridRow>
                        <GridCol setWidth="two-thirds">
                            <AssignToUserSelect selectedLogin={selectedLogin} setSelectedLogin={setSelectedLogin} />
                        </GridCol>
                        <GridCol setWidth="one-third">
                            <Button
                                label={t('tasks.assignToUser')}
                                className={'idsk-button--secondary ' + styles.marginTop30}
                                onClick={() => reassignTask(true)}
                            />
                        </GridCol>
                    </GridRow>
                    <GridRow>
                        <GridCol setWidth="two-thirds">
                            <AssignToGroupSelect selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />
                        </GridCol>
                        <GridCol setWidth="one-third">
                            <Button
                                label={t('tasks.assignToGroup')}
                                className={'idsk-button--secondary ' + styles.marginTop30}
                                onClick={() => reassignTask(false)}
                            />
                        </GridCol>
                    </GridRow>
                </>
            ) : (
                <>
                    <Button label={t('tasks.toMe')} className="idsk-button" onClick={() => reassignTask(true)} />
                </>
            )}

            <div className={styles.taskDetailGrid}>
                {task?.dueDate && (
                    <>
                        <label className="govuk-label">{t('tasks.deadline')}</label>
                        <TextBody>{t('dateTime', { date: task?.dueDate })}</TextBody>
                    </>
                )}
                <label className="govuk-label">{t('tasks.tableHeaders.createdAt')}:</label>
                <TextBody>{t('dateTime', { date: task?.createdAt })}</TextBody>
                <label className="govuk-label">{t('tasks.state')}:</label>
                <TextBody>{t(`tasks.${task?.state}`)}</TextBody>
                <label className="govuk-label">{t('tasks.tableHeaders.type')}:</label>
                <TextBody>{task?.appId}</TextBody>
                <label className="govuk-label">{t('tasks.assigne')}:</label>
                <TextBody>{task?.assignedTo}</TextBody>
            </div>
            <TextHeading size="M">{t('tasks.description')}</TextHeading>
            <TextBody>
                <div dangerouslySetInnerHTML={{ __html: task?.description ?? '' }} />
            </TextBody>
            <TextHeading size="M">{t('tasks.baseInfo')}</TextHeading>
            <Table<TaskHistory> columns={historyColumns} isLoading={isLoading} error={isError} data={task?.taskHistoryList?.taskHistoryList} />
        </>
    )
}
