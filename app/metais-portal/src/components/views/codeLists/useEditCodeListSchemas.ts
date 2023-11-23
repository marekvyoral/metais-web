import { useTranslation } from 'react-i18next'
import { ObjectSchema, array, boolean, number, object, string } from 'yup'
import { ApiCodelistManager, ApiCodelistName } from '@isdd/metais-common/api/generated/codelist-repo-swagger'

import { IFieldTextRow } from '@/components/views/codeLists/CodeListEditView'

interface IOutput {
    schema: ObjectSchema<{
        base?: boolean
        code: string
        codeListName?: ApiCodelistName
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

export const useEditCodeListSchema = (): IOutput => {
    const { t } = useTranslation()
    const schema = object().shape({
        base: boolean(),
        code: string()
            .required(t('codeListList.requestValidations.codelistCode'))
            .matches(/CL0[0-9]{5}/, t('codeListList.requestValidations.codelistCodeFormat'))
            .length(8, t('codeListList.requestValidations.codelistCodeFormat')),
        codeListName: object().shape({
            value: string().required(t('codeListList.requestValidations.codelistName')),
            effectiveFrom: string().required(t('codeListList.requestValidations.dateFrom')),
            effectiveTo: string(),
        }),
        newCodeListName: object().shape({
            value: string(),
            effectiveFrom: string().when('value', {
                is: (value: string | undefined) => value && value.length > 0,
                then: () => string().required(t('codeListList.requestValidations.dateFrom')),
            }),
            effectiveTo: string(),
        }),
        codeListNotes: array().of(
            object().shape({
                id: number().required(),
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
                effectiveTo: string(),
            }),
        ),
        newMainGestor: object().shape({
            value: string(),
            effectiveFrom: string().when('value', {
                is: (value: string | undefined) => value && value.length > 0,
                then: () => string().required(t('codeListList.requestValidations.dateFrom')),
            }),
            effectiveTo: string(),
        }),
        nextGestor: array().of(
            object().shape({
                value: string(),
                effectiveFrom: string(),
                effectiveTo: string(),
            }),
        ),
        refIndicator: string(),
        effectiveFrom: string().required(t('codeListList.requestValidations.effectiveFrom')),
        effectiveTo: string(),

        name: string().required(t('codeListList.requestValidations.name')),
        lastName: string().required(t('codeListList.requestValidations.lastName')),
        phone: string().required(t('codeListList.requestValidations.phone')),
        email: string().required(t('codeListList.requestValidations.email')).email(t('codeListList.requestValidations.emailFormat')),
    })

    return {
        schema,
    }
}
