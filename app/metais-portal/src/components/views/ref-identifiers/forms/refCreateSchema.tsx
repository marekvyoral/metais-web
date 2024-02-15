import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { TFunction } from 'i18next'
import { array, object, string } from 'yup'

export enum RefCatalogFormTypeEnum {
    OWNER = 'owner',
    DATASET = 'dataset',
    PO = 'po',
}

export enum RefTemplateUriFormTypeEnum {
    OWNER = 'owner',
    TEMPLATE_URI = 'templateUri',
}

export enum RefDataItemFormTypeEnum {
    OWNER = 'owner',
    PO = 'po',
    DATA_ITEM = 'dataItem',
}

export enum RefDatasetFormTypeEnum {
    OWNER = 'owner',
    DATA_ITEM = 'dataItem',
    DATA_CODE = 'dataCode',
}

export type RefCatalogFormType = {
    [RefCatalogFormTypeEnum.OWNER]: string
    [RefCatalogFormTypeEnum.DATASET]: string[]
    [RefCatalogFormTypeEnum.PO]: string
    attributes: {
        [ATTRIBUTE_NAME.Gen_Profil_nazov]: string
        [ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]: string
        [ATTRIBUTE_NAME.Gen_Profil_popis]?: string
        [ATTRIBUTE_NAME.Profil_URIKatalog_uri]: string
        [ATTRIBUTE_NAME.Profil_URIKatalog_platne_od]: string
        [ATTRIBUTE_NAME.Profil_URIKatalog_platne_do]?: string
    }
}

export type RefTemplateUriFormType = {
    [RefTemplateUriFormTypeEnum.OWNER]: string
    [RefTemplateUriFormTypeEnum.TEMPLATE_URI]: string
    attributes: {
        [ATTRIBUTE_NAME.Gen_Profil_nazov]: string
        [ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]: string
        [ATTRIBUTE_NAME.Gen_Profil_popis]?: string
        [ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri]: string
        [ATTRIBUTE_NAME.Profil_Individuum_kod]: string
        [ATTRIBUTE_NAME.Profil_Individuum_platne_od]: string
        [ATTRIBUTE_NAME.Profil_Individuum_platne_do]?: string
    }
}

export type RefDataItemFormType = {
    [RefDataItemFormTypeEnum.OWNER]: string
    [RefDataItemFormTypeEnum.PO]: string
    [RefDataItemFormTypeEnum.DATA_ITEM]: string[]
    attributes: {
        [ATTRIBUTE_NAME.Gen_Profil_nazov]: string
        [ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]: string
        [ATTRIBUTE_NAME.Gen_Profil_popis]?: string
        [ATTRIBUTE_NAME.Profil_DatovyPrvok_kod_datoveho_prvku]: string
        [ATTRIBUTE_NAME.Profil_DatovyPrvok_typ_datoveho_prvku]: string
        [ATTRIBUTE_NAME.Profil_DatovyPrvok_historicky_kod]: string
        [ATTRIBUTE_NAME.Profil_DatovyPrvok_zaciatok_ucinnosti]: string
        [ATTRIBUTE_NAME.Profil_DatovyPrvok_koniec_ucinnosti]?: string
    }
}

export type RefDatasetFormType = {
    [RefDatasetFormTypeEnum.OWNER]: string
    [RefDatasetFormTypeEnum.DATA_ITEM]: string
    [RefDatasetFormTypeEnum.DATA_CODE]: string
    attributes: {
        [ATTRIBUTE_NAME.Gen_Profil_nazov]: string
        [ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]: string
        [ATTRIBUTE_NAME.Gen_Profil_popis]?: string
        [ATTRIBUTE_NAME.Profil_URIDataset_uri_datasetu]: string
        [ATTRIBUTE_NAME.Profil_URIDataset_historicky_kod]: string
    }
}

export const refIdentifierCreateCatalogSchema = (t: TFunction<'translation', undefined, 'translation'>) => {
    return object().shape({
        [RefCatalogFormTypeEnum.OWNER]: string().required(t('validation.required')),
        [RefCatalogFormTypeEnum.PO]: string().required(t('validation.required')),
        [RefCatalogFormTypeEnum.DATASET]: array()
            .of(string().min(1).required(t('validation.required')))
            .required(t('validation.required')),
        attributes: object().shape({
            [ATTRIBUTE_NAME.Gen_Profil_nazov]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Gen_Profil_popis]: string(),
            [ATTRIBUTE_NAME.Profil_URIKatalog_uri]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Profil_URIKatalog_platne_od]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Profil_URIKatalog_platne_do]: string(),
        }),
    })
}

export const refIdentifierCreateTemplateUriSchema = (t: TFunction<'translation', undefined, 'translation'>) => {
    return object().shape({
        [RefTemplateUriFormTypeEnum.OWNER]: string().required(t('validation.required')),
        [RefTemplateUriFormTypeEnum.TEMPLATE_URI]: string().required(t('validation.required')),
        attributes: object().shape({
            [ATTRIBUTE_NAME.Gen_Profil_nazov]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Gen_Profil_popis]: string(),
            [ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Profil_Individuum_kod]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Profil_Individuum_platne_od]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Profil_Individuum_platne_do]: string(),
        }),
    })
}

export const refIdentifierCreateDataItemSchema = (t: TFunction<'translation', undefined, 'translation'>) => {
    return object().shape({
        [RefDataItemFormTypeEnum.OWNER]: string().required(t('validation.required')),
        [RefDataItemFormTypeEnum.PO]: string().required(t('validation.required')),
        [RefDataItemFormTypeEnum.DATA_ITEM]: array()
            .of(string().min(1).required(t('validation.required')))
            .required(t('validation.required')),
        attributes: object().shape({
            [ATTRIBUTE_NAME.Gen_Profil_nazov]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Gen_Profil_popis]: string(),
            [ATTRIBUTE_NAME.Profil_DatovyPrvok_kod_datoveho_prvku]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Profil_DatovyPrvok_typ_datoveho_prvku]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Profil_DatovyPrvok_historicky_kod]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Profil_DatovyPrvok_zaciatok_ucinnosti]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Profil_DatovyPrvok_koniec_ucinnosti]: string(),
        }),
    })
}

export const refIdentifierCreateDatasetSchema = (t: TFunction<'translation', undefined, 'translation'>) => {
    return object().shape({
        [RefDatasetFormTypeEnum.OWNER]: string().required(t('validation.required')),
        [RefDatasetFormTypeEnum.DATA_ITEM]: string().required(t('validation.required')),
        [RefDatasetFormTypeEnum.DATA_CODE]: string().required(t('validation.required')),
        attributes: object().shape({
            [ATTRIBUTE_NAME.Gen_Profil_nazov]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Gen_Profil_popis]: string(),
            [ATTRIBUTE_NAME.Profil_URIDataset_uri_datasetu]: string().required(t('validation.required')),
            [ATTRIBUTE_NAME.Profil_URIDataset_historicky_kod]: string().required(t('validation.required')),
        }),
    })
}
