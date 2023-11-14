import { useTranslation } from 'react-i18next'
import { ObjectSchema, array, date, object, string } from 'yup'

export enum AddNewLanguageList {
    'en' = 'en',
    'de' = 'de',
    'hu' = 'hu',
}

interface IItem {
    schema: ObjectSchema<{
        name: string
        code: string
        effectiveFrom: string
    }>
}

export interface NewLanguageFormData {
    language: string
    names: {
        name: string
        slovakName: string
        from: string
        to?: string | null
    }[]
}

interface INewLanguage {
    schema: ObjectSchema<NewLanguageFormData>
}

interface SetDatesFormData {
    validFrom: Date
    effectiveFrom: Date
}

interface ISetDates {
    schema: ObjectSchema<SetDatesFormData>
}

export const useSetDatesSchema = (): ISetDates => {
    const schema = object().shape({
        validFrom: date().required().default(null),
        effectiveFrom: date().required().default(null),
    })

    return { schema }
}

export const useItemSchema = (): IItem => {
    const { t } = useTranslation()
    const schema = object().shape({
        code: string().required(t('codeListDetail.validations.codeItem')),
        name: string().required(t('codeListDetail.validations.codelistName')),
        effectiveFrom: string().required(t('codeListDetail.validations.validFrom')),
    })

    return {
        schema,
    }
}

export const useNewLanguageSchema = (): INewLanguage => {
    const schema = object().shape({
        language: string().trim().required().oneOf(Object.values(AddNewLanguageList)),
        names: array()
            .of(
                object().shape({
                    name: string().required(),
                    slovakName: string().required(),
                    from: string().required(),
                    to: string().nullable().notRequired(),
                }),
            )
            .min(1)
            .required(),
    })

    return {
        schema,
    }
}
