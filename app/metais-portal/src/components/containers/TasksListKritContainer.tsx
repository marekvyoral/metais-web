import { useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import React, { useState } from 'react'
import { Task, useCreateTaskHook } from '@isdd/metais-common/api/generated/tasks-swagger'

import { IKritTasksListView } from '@/components/views/tasks/KritTasksListView'

export interface ITasksListKritContainerProps {
    entityId: string
    View: React.FC<IKritTasksListView>
}

export const TasksListKritContainer: React.FC<ITasksListKritContainerProps> = ({ View, entityId }) => {
    const createTaskHiook = useCreateTaskHook()
    const { data: appIds, isError, isLoading } = useGetValidEnum('TYPE_TASK_APP_ID')
    const [isLoadingSave, setIsLoadingSave] = useState(false)
    const [isErrorSave, setIsErrorSave] = useState(false)
    const [isSuccessSave, setIsSuccessSave] = useState(false)

    const onSaveForm = (task: Task, callback: () => void) => {
        setIsLoadingSave(true)
        createTaskHiook(task)
            .then(() => {
                setIsSuccessSave(true)
                callback()
            })
            .catch(() => {
                setIsErrorSave(true)
            })
            .finally(() => {
                setIsLoadingSave(false)
            })
    }

    const resetSuccessSave = () => {
        setIsSuccessSave(false)
    }

    return (
        <View
            entityId={entityId}
            appIds={appIds}
            onSaveForm={onSaveForm}
            isError={isError || isErrorSave}
            isLoading={isLoading || isLoadingSave}
            isSuccessSave={isSuccessSave}
            resetSuccessSave={resetSuccessSave}
        />
    )
}
