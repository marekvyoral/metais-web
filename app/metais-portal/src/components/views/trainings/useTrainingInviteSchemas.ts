import { REGEX_EMAIL, REGEX_TEL } from '@isdd/metais-common/constants'
import { User } from '@isdd/metais-common/contexts/auth/authContext'
import { useTranslation } from 'react-i18next'
import { ObjectSchema, object, string, boolean } from 'yup'

interface IOutput {
    schema: ObjectSchema<{
        firstName: string
        lastName: string
        email: string
        phone: string
        organization: string
        consent?: boolean
    }>
}

export const useTrainingInviteSchema = (user?: User | null): IOutput => {
    const { t } = useTranslation()
    const schema = object().shape({
        firstName: string().required(t('validation.required')),
        lastName: string().required(t('validation.required')),
        organization: string().required(t('validation.required')),
        phone: string().required(t('validation.required')).matches(REGEX_TEL, t('validation.invalidPhone')),
        email: string().required(t('validation.required')).matches(REGEX_EMAIL, t('validation.invalidEmail')),
        consent: boolean().test({
            name: 'required-consent',
            test: function (value) {
                if (!user) {
                    return value === true
                }
                return true
            },
            message: t('validation.required'),
        }),
    })

    return {
        schema,
    }
}
