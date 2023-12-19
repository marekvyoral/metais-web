import { ObjectSchema, object, string } from 'yup'
import { TFunction } from 'i18next'
import { ApiReferenceRegisterState } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { REGEX_EMAIL, REGEX_TEL } from '@isdd/metais-common/constants'

export interface IRefRegisterCreateFormData {
    refRegisters: {
        codeMetaIS?: string
        creator?: string
        sourceRegister?: string
        name?: string
        refId?: string
        effectiveFrom?: string
        effectiveTo?: string
        state?: ApiReferenceRegisterState
        manager: {
            PO?: string
            email?: string
            firstName?: string
            lastName?: string
            phoneNumber?: string
        }
        registrar: {
            PO?: string
            email?: string
            firstName?: string
            lastName?: string
            phoneNumber?: string
        }
        additionalData?: string
    }
}

export const createRefRegisterSchema = (
    t: TFunction<'translation', undefined, 'translation'>,
    showCreatorForm: boolean,
    showSourceRegisterForm: boolean,
): ObjectSchema<IRefRegisterCreateFormData> => {
    return object().shape({
        refRegisters: object().shape({
            creator: string().when([], {
                is: () => showCreatorForm,
                then: (schema) => schema.required(t('validation.required')),
                otherwise: (schema) => schema.notRequired(),
            }),
            name: string().required(t('validation.required')),
            sourceRegister: string().when([], {
                is: () => showSourceRegisterForm,
                then: (schema) => schema.required(t('validation.required')),
                otherwise: (schema) => schema.notRequired(),
            }),
            codeMetaIS: string().required(t('validation.required')),
            refId: string().required(t('validation.required')),
            effectiveFrom: string().required(t('validation.required')),
            manager: object().shape({
                PO: string().required(t('validation.required')),
                lastName: string().required(t('validation.required')),
                firstName: string().required(t('validation.required')),
                phoneNumber: string().matches(REGEX_TEL, t('validation.invalidPhone')).required(t('validation.required')),
                email: string().matches(REGEX_EMAIL, t('validation.invalidEmail')).required(t('validation.required')),
            }),
            registrar: object().shape({
                PO: string().required(t('validation.required')),
                lastName: string().required(t('validation.required')),
                firstName: string().required(t('validation.required')),
                phoneNumber: string().matches(REGEX_TEL, t('validation.invalidPhone')).required(t('validation.required')),
                email: string().matches(REGEX_EMAIL, t('validation.invalidEmail')).required(t('validation.required')),
            }),
            additionalData: string().required(t('validation.required')),
        }),
    })
}
