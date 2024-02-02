import React from 'react'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { TasksListKritContainer } from '@/components/containers/TasksListKritContainer'
import { KritTasksListView } from '@/components/views/tasks/KritTasksListView'

const Tasks: React.FC = () => {
    const { entityId } = useGetEntityParamsFromUrl()

    return (
        <TasksListKritContainer
            entityId={entityId ?? ''}
            View={(props) => {
                return (
                    <KritTasksListView
                        entityId={props.entityId}
                        appIds={props.appIds}
                        onSaveForm={props.onSaveForm}
                        isLoading={props.isLoading}
                        isError={props.isError}
                        isSuccessSave={props.isSuccessSave}
                        resetSuccessSave={props.resetSuccessSave}
                    />
                )
            }}
        />
    )
}

export default Tasks
