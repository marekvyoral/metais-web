import { object, string } from 'yup'
import { TFunction } from 'i18next'
import { REGEX_EMAIL, phoneOrEmptyStringRegex } from '@isdd/metais-common/constants'

import { InputNames } from './UserDetailForm'

export const getUserManagementFormSchema = (t: TFunction<'translation', undefined, 'translation'>) => {
    const userManagementFormSchema = object().shape({
        [InputNames.FIRST_NAME]: string().required(t('managementList.required', { value: t('managementList.firstName') })),
        [InputNames.LAST_NAME]: string().required(t('managementList.required', { value: t('managementList.lastName') })),
        [InputNames.LOGIN]: string()
            .test('no-spaces', t('managementList.noSpacesError', { value: t('managementList.login') }), (value) => !/\s/.test(value ?? ''))
            .required(t('managementList.required', { value: t('managementList.login') })),
        [InputNames.EMAIL]: string()
            .email(t('managementList.emailFormat'))
            .required(t('managementList.required', { value: t('managementList.email') }))
            .matches(REGEX_EMAIL, t('managementList.emailFormat')),
        [InputNames.MOBILE]: string().matches(phoneOrEmptyStringRegex, t('managementList.phoneFormat')),
        [InputNames.PHONE]: string().matches(phoneOrEmptyStringRegex, t('managementList.phoneFormat')),
        [InputNames.POSITION]: string(),
    })

    return userManagementFormSchema
}
