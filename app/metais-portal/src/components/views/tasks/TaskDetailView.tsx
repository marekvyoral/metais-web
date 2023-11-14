import { BreadCrumbs, Button, GridCol, GridRow, HomeIcon, Table, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Identity, RoleOrgIdentity } from '@isdd/metais-common/api/generated/iam-swagger'
import { Task, TaskHistory, TaskState } from '@isdd/metais-common/api/generated/tasks-swagger'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { DefinitionListItem } from '@isdd/metais-common/components/definition-list/DefinitionListItem'
import { ColumnDef } from '@tanstack/react-table'
import { QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import React, { SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeHtmlComponent } from '@isdd/idsk-ui-kit/src/save-html-component/SafeHtmlComponent'

import { AssignToGroupSelect } from './AssignToGroupSelect'
import styles from './tasks.module.scss'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { IdentitySelect } from '@/components/identity-lazy-select/IdentitySelect'
interface ITaskDetailView {
    task: Task | undefined
    historyColumns: ColumnDef<TaskHistory>[]
    isLoading: boolean
    isError: boolean
    closeTask: () => void
    reassignTask: (assignToUser: boolean) => void
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
    setSelectedLogin,
    selectedGroup,
    setSelectedGroup,
}) => {
    const { t } = useTranslation()

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('tasks.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('tasks.tasks'), href: RouteNames.TASKS },
                    { label: `${task?.name}`, href: '' },
                ]}
            />
            <MainContentWrapper>
                <QueryFeedback loading={isLoading} error={false} withChildren>
                    <FlexColumnReverseWrapper>
                        <TextHeading size="L">{task?.name}</TextHeading>
                        {isError && <QueryFeedback loading={false} error={isError} />}
                    </FlexColumnReverseWrapper>
                    {task?.state !== TaskState.DONE ? (
                        <>
                            <Button onClick={closeTask} label={t('tasks.finish')} className="idsk-button" />

                            <GridRow>
                                <GridCol setWidth="two-thirds">
                                    <IdentitySelect
                                        name="identitySelect"
                                        onChange={(val) => {
                                            setSelectedLogin(Array.isArray(val) ? val[0] : val)
                                        }}
                                    />
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
                    <DefinitionList>
                        {task?.dueDate && <DefinitionListItem label={t('tasks.deadline')} value={t('dateTime', { date: task?.dueDate })} />}
                        <DefinitionListItem label={t('tasks.tableHeaders.createdAt')} value={t('dateTime', { date: task?.createdAt })} />
                        <DefinitionListItem label={t('tasks.state')} value={t(`tasks.${task?.state}`)} />
                        <DefinitionListItem label={t('tasks.tableHeaders.type')} value={task?.appId ?? ''} />
                        <DefinitionListItem label={t('tasks.assigne')} value={task?.assignedTo ?? ''} />
                    </DefinitionList>
                    <TextHeading size="L">{t('tasks.description')}</TextHeading>
                    <TextBody>
                        <SafeHtmlComponent dirtyHtml={task?.description ?? ''} />
                    </TextBody>
                    <TextHeading size="L">{t('tasks.baseInfo')}</TextHeading>
                    <Table<TaskHistory>
                        columns={historyColumns}
                        isLoading={isLoading}
                        error={isError}
                        data={task?.taskHistoryList?.taskHistoryList}
                    />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
