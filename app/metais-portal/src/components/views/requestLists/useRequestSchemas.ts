import { useTranslation } from 'react-i18next'
import { ObjectSchema, array, boolean, object, string, date, number } from 'yup'
import { REGEX_EMAIL, REGEX_TEL } from '@isdd/metais-common/constants'

import { INoteRow } from '@/components/views/requestLists/CreateRequestView'

interface IOutput {
    schema: ObjectSchema<{
        base?: boolean
        gid?: string
        codeListName: string
        codeListCode: string
        resortCode: string
        mainGestor: string
        refIndicator?: string
        notes?: INoteRow[]
        name: string
        lastName: string
        phone: string
        email: string
        validDate?: Date | null
        startDate?: Date | null
    }>
}

interface IItem {
    schema: ObjectSchema<{
        codeItem: string
        codeName: string
    }>
}

export interface IItemDate {
    schema: ObjectSchema<{
        effectiveFrom: Date
        validDate: Date
    }>
}

export const useCreateRequestSchema = (canEdit: boolean): IOutput => {
    const { t } = useTranslation()
    let schema

    schema = object().shape({
        base: boolean(),
        codeListName: string().required(t('codeListList.requestValidations.codelistName')),
        codeListCode: string()
            .required(t('codeListList.requestValidations.codelistCode'))
            .matches(/CL0[0-9]{5}/, t('codeListList.requestValidations.codelistCodeFormat'))
            .length(8, t('codeListList.requestValidations.codelistCodeFormat')),
        resortCode: string().required(t('codeListList.requestValidations.resortCode')),
        mainGestor: string().required(t('codeListList.requestValidations.mainGestor')),
        gid: string(),
        refIndicator: string().transform((curr, orig) => (orig === null ? undefined : curr)),
        notes: array().of(
            object().shape({
                text: string(),
            }),
        ),
        name: string().required(t('codeListList.requestValidations.name')),
        lastName: string().required(t('codeListList.requestValidations.lastName')),
        phone: string().required(t('codeListList.requestValidations.phone')).matches(REGEX_TEL, t('codeListList.requestValidations.phoneFormat')),
        email: string().required(t('codeListList.requestValidations.email')).matches(REGEX_EMAIL, t('codeListList.requestValidations.emailFormat')),
        codeListState: string(),
        validDate: date(),
        startDate: date(),
        valid: boolean(),
        type: string(),
        charCount: number(),
        prefix: string().required(t('codeListList.requestValidations.prefix')),
    })

    if (!canEdit) {
        schema = schema.concat(
            object().shape({
                validDate: date()
                    .nullable()
                    .transform((curr, orig) => (orig === '' ? null : curr))
                    .required(t('codeListList.requestValidations.effectiveFrom'))
                    .typeError(t('codeListList.requestValidations.dateFormat')),
                startDate: date()
                    .nullable()
                    .transform((curr, orig) => (orig === '' ? null : curr))
                    .typeError(t('codeListList.requestValidations.dateFormat')),
            }),
        )
    }

    return {
        schema,
    }
}

export const useItemSchema = (): IItem => {
    const { t } = useTranslation()
    const schema = object().shape({
        codeItem: string().required(t('codeListList.requestValidations.itemCode')),
        codeName: string().required(t('codeListList.requestValidations.itemName')),
        order: number()
            .typeError(t('codeListList.requestValidations.orderFormat'))
            .nullable()
            .transform((_, val) => (val !== '' ? Number(val) : null)),
    })

    return {
        schema,
    }
}

export const useItemDateSchema = (): IItemDate => {
    const { t } = useTranslation()
    const schema = object().shape({
        effectiveFrom: date()
            .nullable()
            .transform((curr, orig) => (orig === '' ? null : curr))
            .required(t('codeListList.requestValidations.effectiveFrom'))
            .typeError(t('codeListList.requestValidations.dateFormat')),
        validDate: date()
            .nullable()
            .transform((curr, orig) => (orig === '' ? null : curr))
            .required(t('codeListList.requestValidations.dateFrom'))
            .typeError(t('codeListList.requestValidations.dateFormat')),
    })

    return {
        schema,
    }
}
