import { useTranslation } from 'react-i18next'
import { ObjectSchema, array, boolean, object, string } from 'yup'

import { INoteRow } from '@/components/views/requestLists/CreateRequestView'

interface IOutput {
    schema: ObjectSchema<{
        base?: boolean
        gid?: string
        codeListName: string
        codeListId: string
        resortCode: string
        mainGestor: string
        refIndicator?: string
        notes?: INoteRow[]
        name: string
        lastName: string
        phone: string
        email: string
    }>
}

interface IItem {
    schema: ObjectSchema<{
        codeItem: string
        codeName: string
    }>
}

interface IItemEdit {
    schema: ObjectSchema<{
        codeItem: string
        codeName: string
        effectiveFrom: string
        validDate: string
    }>
}

export interface IItemDate {
    schema: ObjectSchema<{
        effectiveFrom: string
        validDate: string
    }>
}

export const useCreateRequestSchema = (): IOutput => {
    const { t } = useTranslation()
    const schema = object().shape({
        base: boolean(),
        codeListName: string().required(t('codeListList.requestValidations.codelistName')),
        codeListId: string()
            .required(t('codeListList.requestValidations.codelistId'))
            .matches(/CL0[0-9]{5}/, t('codeListList.requestValidations.codelistIdFormat'))
            .length(8, t('codeListList.requestValidations.codelistIdFormat')),
        resortCode: string().required(t('codeListList.requestValidations.resortCode')),
        mainGestor: string().required(t('codeListList.requestValidations.mainGestor')),
        gid: string(),
        refIndicator: string(),
        notes: array(),
        name: string().required(t('codeListList.requestValidations.name')),
        lastName: string().required(t('codeListList.requestValidations.lastName')),
        phone: string().required(t('codeListList.requestValidations.phone')),
        email: string().required(t('codeListList.requestValidations.email')).email(),
        codeListSate: string(),
    })

    return {
        schema,
    }
}

export const useItemSchema = (): IItem => {
    const { t } = useTranslation()
    const schema = object().shape({
        codeItem: string().required(t('codeListList.requestValidations.codelistName')),
        codeName: string().required(t('codeListList.requestValidations.codelistName')),
    })

    return {
        schema,
    }
}

export const useItemEditSchema = (): IItemEdit => {
    const { t } = useTranslation()
    const schema = object().shape({
        codeItem: string().required(t('codeListList.requestValidations.codelistName')),
        codeName: string().required(t('codeListList.requestValidations.codelistName')),
        validDate: string().required(t('codeListList.requestValidations.startDate')),
        effectiveFrom: string().required(t('codeListList.requestValidations.startDate')),
    })

    return {
        schema,
    }
}

export const useItemDateSchema = (): IItemDate => {
    const { t } = useTranslation()
    const schema = object().shape({
        effectiveFrom: string().required(t('codeListList.requestValidations.codelistName')),
        validDate: string().required(t('codeListList.requestValidations.codelistName')),
    })

    return {
        schema,
    }
}
