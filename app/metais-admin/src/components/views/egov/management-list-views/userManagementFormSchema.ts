import { object, string } from 'yup'
import { TFunction } from 'i18next'

import { InputNames } from './UserDetailForm'

export const getUserManagementFormSchema = (t: TFunction<'translation', undefined, 'translation'>) => {
    const userManagementFormSchema = object().shape({
        [InputNames.FIRST_NAME]: string().required(t('managementList.required', { value: t('managementList.firstName') })),
        [InputNames.LAST_NAME]: string().required(t('managementList.required', { value: t('managementList.lastName') })),
        [InputNames.LOGIN]: string(),
        [InputNames.EMAIL]: string()
            .email(t('managementList.emailFormat'))
            .required(t('managementList.required', { value: t('managementList.email') })),
        [InputNames.MOBILE]: string().required(t('managementList.required', { value: t('managementList.mobile') })),
        [InputNames.PHONE]: string().required(t('managementList.required', { value: t('managementList.phone') })),
        [InputNames.POSITION]: string(),
    })

    return userManagementFormSchema
}
