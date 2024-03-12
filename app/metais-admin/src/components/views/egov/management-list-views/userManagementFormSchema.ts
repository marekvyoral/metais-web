import { object, string } from 'yup'
import { TFunction } from 'i18next'
import { REGEX_EMAIL, REGEX_TEL } from '@isdd/metais-common/constants'

import { InputNames } from './UserDetailForm'

export const FIRST_NAME_MAXIMUM_CHARS = 15
export const LAST_NAME_MAXIMUM_CHARS = 20
const LOGIN_MAXIMUM_CHARS = 40

export const getUserManagementFormSchema = (t: TFunction<'translation', undefined, 'translation'>) => {
    const userManagementFormSchema = object().shape({
        [InputNames.FIRST_NAME]: string()
            .required(t('managementList.required', { value: t('managementList.firstName') }))
            .max(
                FIRST_NAME_MAXIMUM_CHARS,
                `${t('managementList.firstName')} ${t('managementList.MustBeMaximum', { charsNumber: FIRST_NAME_MAXIMUM_CHARS })}`,
            ),
        [InputNames.LAST_NAME]: string()
            .required(t('managementList.required', { value: t('managementList.lastName') }))
            .max(
                LAST_NAME_MAXIMUM_CHARS,
                `${t('managementList.lastName')} ${t('managementList.MustBeMaximum', { charsNumber: LAST_NAME_MAXIMUM_CHARS })}`,
            ),
        [InputNames.LOGIN]: string()
            .required(t('managementList.required', { value: t('managementList.loginEmail') }))
            .email(t('managementList.emailFormat'))
            .matches(REGEX_EMAIL, t('managementList.emailFormat'))
            .test('no-spaces', t('managementList.noSpacesError', { value: t('managementList.loginEmail') }), (value) => !/\s/.test(value ?? ''))
            .max(LOGIN_MAXIMUM_CHARS, `${t('managementList.loginEmail')} ${t('managementList.MustBeMaximum', { charsNumber: LOGIN_MAXIMUM_CHARS })}`),
        [InputNames.MOBILE]: string().nullable().matches(REGEX_TEL, t('managementList.phoneFormat')),
        [InputNames.POSITION]: string().nullable(),
    })

    return userManagementFormSchema
}
