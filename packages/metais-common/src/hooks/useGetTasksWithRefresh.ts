import { useQuery } from '@tanstack/react-query'

import { TaskState, useGetTasks } from '@isdd/metais-common/api/generated/tasks-swagger'
import { TASKS_QUERY_KEY } from '@isdd/metais-common/constants'

interface useGetTasksWithRefreshProps {
    assignedTo: string[]
}

export const useGetTasksWithRefresh = ({ assignedTo }: useGetTasksWithRefreshProps) => {
    const getTaskMutation = useGetTasks()
    const { data } = useQuery({
        queryKey: [TASKS_QUERY_KEY],
        queryFn: async () => {
            return await getTaskMutation.mutateAsync({
                data: {
                    assignedTo: assignedTo,
                    sortBy: 'id',
                    perPage: 10,
                    pageNumber: 1,
                    ascending: false,
                    states: [TaskState.CREATED, TaskState.IN_PROGRESS],
                },
            })
        },
        refetchInterval: 30000,
    })

    return {
        data,
    }
}
