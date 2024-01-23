import { useTranslation } from 'react-i18next'
import { ObjectSchema, TestContext, array, boolean, number, object, string } from 'yup'
import { ApiCodelistManager, ApiCodelistName } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { REGEX_EMAIL, REGEX_TEL } from '@isdd/metais-common/constants'

import { IFieldTextRow } from '@/components/views/codeLists/CodeListEditView'

interface IOutput {
    schema: ObjectSchema<{
        base?: boolean
        code: string
        codeListNames: ApiCodelistName[]
        newCodeListName?: ApiCodelistName
        codeListNotes?: IFieldTextRow[]
        codeListSource?: IFieldTextRow[]
        mainGestor?: ApiCodelistManager[]
        newMainGestor?: ApiCodelistManager
        nextGestor?: ApiCodelistManager[]
        refIndicator?: string
        effectiveFrom?: string
        effectiveTo?: string
        name: string
        lastName: string
        email: string
        phone: string
    }>
}

export const effectiveToGreaterThanEffectiveFrom = (value: string | undefined, context: TestContext) => {
    const effectiveFrom = context.from?.[0].value.effectiveFrom
    if (!value || !effectiveFrom) return true
    return new Date(effectiveFrom) < new Date(value)
}

export const useEditCodeListSchema = (): IOutput => {
    const { t } = useTranslation()
    const schema = object().shape({
        base: boolean(),
        code: string()
            .required(t('codeListList.requestValidations.codelistCode'))
            .matches(/CL0[0-9]{5}/, t('codeListList.requestValidations.codelistCodeFormat'))
            .length(8, t('codeListList.requestValidations.codelistCodeFormat')),
        codeListNames: array()
            .of(
                object().shape({
                    value: string().required(t('codeListList.requestValidations.codelistName')),
                    effectiveFrom: string().when('value', {
                        is: (value: string | undefined) => value && value.length > 0,
                        then: () => string().required(t('codeListList.requestValidations.dateFrom')),
                    }),
                    effectiveTo: string().test(
                        'largerThan',
                        t('codeListList.requestValidations.dateGreaterThan'),
                        effectiveToGreaterThanEffectiveFrom,
                    ),
                }),
            )
            .defined(),
        newCodeListName: object().shape({
            value: string(),
            effectiveFrom: string().when('value', {
                is: (value: string | undefined) => value && value.length > 0,
                then: () => string().required(t('codeListList.requestValidations.dateFrom')),
            }),
            effectiveTo: string().test('largerThan', t('codeListList.requestValidations.dateGreaterThan'), effectiveToGreaterThanEffectiveFrom),
        }),
        codeListNotes: array().of(
            object().shape({
                text: string(),
            }),
        ),
        codeListSource: array().of(
            object().shape({
                id: number().required(),
                text: string(),
            }),
        ),
        mainGestor: array().of(
            object().shape({
                value: string().required(t('codeListList.requestValidations.mainGestor')),
                effectiveFrom: string().required(t('codeListList.requestValidations.dateFrom')),
                effectiveTo: string().test('largerThan', t('codeListList.requestValidations.dateGreaterThan'), effectiveToGreaterThanEffectiveFrom),
            }),
        ),
        newMainGestor: object().shape({
            value: string(),
            effectiveFrom: string().when('value', {
                is: (value: string | undefined) => value && value.length > 0,
                then: () => string().required(t('codeListList.requestValidations.dateFrom')),
            }),
            effectiveTo: string().test('largerThan', t('codeListList.requestValidations.dateGreaterThan'), effectiveToGreaterThanEffectiveFrom),
        }),
        nextGestor: array().of(
            object().shape({
                value: string(),
                effectiveFrom: string(),
                effectiveTo: string().test('largerThan', t('codeListList.requestValidations.dateGreaterThan'), effectiveToGreaterThanEffectiveFrom),
            }),
        ),
        refIndicator: string(),
        effectiveFrom: string().required(t('codeListList.requestValidations.effectiveFrom')),
        effectiveTo: string().test('largerThan', t('codeListList.requestValidations.dateGreaterThan'), effectiveToGreaterThanEffectiveFrom),
        name: string().required(t('codeListList.requestValidations.name')),
        lastName: string().required(t('codeListList.requestValidations.lastName')),
        phone: string().required(t('codeListList.requestValidations.phone')).matches(REGEX_TEL, t('codeListList.requestValidations.phoneFormat')),
        email: string().required(t('codeListList.requestValidations.email')).matches(REGEX_EMAIL, t('codeListList.requestValidations.emailFormat')),
    })

    return {
        schema,
    }
}
