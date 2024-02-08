import { ATTRIBUTE_NAME, RefIdentifierTypeEnum } from '@isdd/metais-common/api'
import { TFunction } from 'i18next'
import { array, boolean, number, object, string } from 'yup'

const MAX_DESCRIPTION_CHAR_NUMBER = 255

export enum RefCatalogFormTypeEnum {
    OWNER = 'owner',
    DATASET = 'dataset',
    PO = 'po',
}

export type RefCatalogFormType = {
    [RefCatalogFormTypeEnum.OWNER]: string
    [RefCatalogFormTypeEnum.DATASET]: string[]
    [RefCatalogFormTypeEnum.PO]: string
    attributes: {
        [ATTRIBUTE_NAME.Gen_Profil_nazov]: string
        [ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]: string
        [ATTRIBUTE_NAME.Gen_Profil_popis]: string
        [ATTRIBUTE_NAME.Profil_URIKatalog_uri]: string
        [ATTRIBUTE_NAME.Profil_URIKatalog_platne_od]: string
        [ATTRIBUTE_NAME.Profil_URIKatalog_platne_do]: string
    }
}

export const refIdentifierCreateCatalogSchema = (t: TFunction<'translation', undefined, 'translation'>) => {
    return object().shape({
        // owner: string().required(),
        [RefCatalogFormTypeEnum.OWNER]: string().required(t('validation.required')),
        [RefCatalogFormTypeEnum.PO]: string().required(t('validation.required')),
        [RefCatalogFormTypeEnum.DATASET]: array().of(string().min(1).required(t('validation.required'))),
        attributes: object().shape({
            [ATTRIBUTE_NAME.Gen_Profil_nazov]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Gen_Profil_popis]: string(),
            [ATTRIBUTE_NAME.Profil_URIKatalog_uri]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Profil_URIKatalog_platne_od]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Profil_URIKatalog_platne_do]: string(),
        }),
        // [CodelistDetailEnum.CODE]: string()
        //     .matches(regexPattern, t('codelists.wrongRegex', { letters: 'A-Z', signs: '_' }))
        //     .notOneOf(itemCodes, t('codelists.codeExist'))
        //     .required(t('codelists.codeError')),
        // [CodelistDetailEnum.VALUE]: string().required(t('codelists.valueError')),
        // [CodelistDetailEnum.ENG_VALUE]: string().required(t('codelists.engValueError')),
        // [CodelistDetailEnum.DESCRIPTION]: string()
        //     .required(t('codelists.descriptionError'))
        //     .max(MAX_DESCRIPTION_CHAR_NUMBER, t('codelists.descriptionMaxError', { charNumber: MAX_DESCRIPTION_CHAR_NUMBER })),
        // [CodelistDetailEnum.ENG_DESCRIPTION]: string()
        //     .required(t('codelists.engDescriptionError'))
        //     .max(MAX_DESCRIPTION_CHAR_NUMBER, t('codelists.descriptionMaxError', { charNumber: MAX_DESCRIPTION_CHAR_NUMBER })),
        // [CodelistDetailEnum.VALIDITY]: boolean(),
    })
}
