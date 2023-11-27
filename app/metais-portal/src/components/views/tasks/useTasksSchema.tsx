import { object, string } from 'yup'
import { useTranslation } from 'react-i18next'

import { IItemTask } from './KritTasksListView'

export const useCreateTasksSchema = (): IItemTask => {
    const { t } = useTranslation()
    const schema = object().shape({
        name: string().required(t('tasksKris.requiredField')).default(null),
        description: string().required(t('tasksKris.requiredField')).default(null),
        deadline: string().required(t('tasksKris.requiredField')).default(null),
        user: string().required(t('tasksKris.requiredField')).default(null),
    })

    return { schema }
}
