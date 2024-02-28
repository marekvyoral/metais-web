import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { ConfigurationItemUiAttributes } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { formatDateForDefaultValue } from '@isdd/metais-common/index'
import { TFunction } from 'i18next'
import { DateTime } from 'luxon'
import { array, date, object, string } from 'yup'

import { getNameByAttribute, getRequiredByAttribute } from '@/components/views/codeLists/CodeListDetailUtils'

const midNight = new Date(new Date().setHours(0, 0, 0, 0))

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
        [ATTRIBUTE_NAME.Gen_Profil_nazov]?: string
        [ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]?: string
        [ATTRIBUTE_NAME.Gen_Profil_popis]?: string
        [ATTRIBUTE_NAME.Profil_URIKatalog_uri]?: string
        [ATTRIBUTE_NAME.Profil_URIKatalog_platne_od]?: Date
        [ATTRIBUTE_NAME.Profil_URIKatalog_platne_do]?: Date | null
    }
}

export type RefTemplateUriFormType = {
    [RefTemplateUriFormTypeEnum.OWNER]: string
    [RefTemplateUriFormTypeEnum.TEMPLATE_URI]: string
    attributes: {
        [ATTRIBUTE_NAME.Gen_Profil_nazov]?: string
        [ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]?: string
        [ATTRIBUTE_NAME.Gen_Profil_popis]?: string
        [ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri]?: string
        [ATTRIBUTE_NAME.Profil_Individuum_kod]?: string
        [ATTRIBUTE_NAME.Profil_Individuum_platne_od]?: Date
        [ATTRIBUTE_NAME.Profil_Individuum_platne_do]?: Date | null
    }
}

export type RefDataItemFormType = {
    [RefDataItemFormTypeEnum.OWNER]: string
    [RefDataItemFormTypeEnum.PO]: string
    [RefDataItemFormTypeEnum.DATA_ITEM]: string[]
    attributes: {
        [ATTRIBUTE_NAME.Gen_Profil_nazov]?: string
        [ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]?: string
        [ATTRIBUTE_NAME.Gen_Profil_popis]?: string
        [ATTRIBUTE_NAME.Profil_DatovyPrvok_kod_datoveho_prvku]?: string
        [ATTRIBUTE_NAME.Profil_DatovyPrvok_typ_datoveho_prvku]?: string
        [ATTRIBUTE_NAME.Profil_DatovyPrvok_historicky_kod]?: string
        [ATTRIBUTE_NAME.Profil_DatovyPrvok_zaciatok_ucinnosti]?: Date
        [ATTRIBUTE_NAME.Profil_DatovyPrvok_koniec_ucinnosti]?: Date | null
    }
}

export type RefDatasetFormType = {
    [RefDatasetFormTypeEnum.OWNER]: string
    [RefDatasetFormTypeEnum.DATA_ITEM]: string
    [RefDatasetFormTypeEnum.DATA_CODE]: string
    attributes: {
        [ATTRIBUTE_NAME.Gen_Profil_nazov]?: string
        [ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]?: string
        [ATTRIBUTE_NAME.Gen_Profil_popis]?: string
        [ATTRIBUTE_NAME.Profil_URIDataset_uri_datasetu]?: string
        [ATTRIBUTE_NAME.Profil_URIDataset_historicky_kod]?: string
    }
}

const getCurrentDateValueToCompare = (attributesDefaultValues: ConfigurationItemUiAttributes, technicalName: string) => {
    const currentValue = attributesDefaultValues[technicalName]
    const isCurrentValueSmallerThanActualDate =
        currentValue && DateTime.fromJSDate(new Date(currentValue)).isValid && new Date(currentValue).getTime() < new Date().getTime() ? true : false
    const currentDateValueToCompare = isCurrentValueSmallerThanActualDate ? currentValue ?? midNight : midNight
    return currentDateValueToCompare
}

export const refIdentifierCreateCatalogSchema = (
    t: TFunction<'translation', undefined, 'translation'>,
    language: string,
    formDefaultValues: ConfigurationItemUiAttributes,
    attributes: Attribute[] | undefined,
) => {
    return object().shape({
        [RefCatalogFormTypeEnum.OWNER]: string().required(t('validation.required')),
        [RefCatalogFormTypeEnum.PO]: string().required(t('validation.required')),
        [RefCatalogFormTypeEnum.DATASET]: array()
            .of(string().min(1).required(t('validation.required')))
            .required(t('validation.required')),
        attributes: object().shape({
            [ATTRIBUTE_NAME.Gen_Profil_nazov]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_nazov))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
            [ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
            [ATTRIBUTE_NAME.Gen_Profil_popis]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_popis))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
            [ATTRIBUTE_NAME.Profil_URIKatalog_uri]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIKatalog_uri))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
            [ATTRIBUTE_NAME.Profil_URIKatalog_platne_od]: date()
                .typeError(t('validation.required'))
                .transform((curr, orig) => (orig === '' ? null : curr))
                .when('isRequired', (_, current) => {
                    if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIKatalog_platne_od))) {
                        return current.required(t('validation.required'))
                    }
                    return current
                })
                .min(
                    getCurrentDateValueToCompare(formDefaultValues, ATTRIBUTE_NAME.Profil_URIKatalog_platne_od),
                    `${t('validation.dateMustBeEqualOrGreaterThen')} ${formatDateForDefaultValue(
                        getCurrentDateValueToCompare(formDefaultValues, ATTRIBUTE_NAME.Profil_URIKatalog_platne_od).toString(),
                        'dd.MM.yyyy',
                    )}`,
                ),
            [ATTRIBUTE_NAME.Profil_URIKatalog_platne_do]: date()
                .nullable()
                .transform((curr, orig) => (orig === '' ? null : curr))
                .when('isRequired', (_, current) => {
                    if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIKatalog_platne_do))) {
                        return current.required(t('validation.required'))
                    }
                    return current
                })
                .when(ATTRIBUTE_NAME.Profil_URIKatalog_platne_od, (from, yupSchema) => {
                    return DateTime.fromJSDate(new Date(`${from}`)).isValid
                        ? yupSchema.min(
                              from,
                              `${t('validation.dateMustBeGreaterThen')} ${getNameByAttribute(
                                  language,
                                  attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIKatalog_platne_od),
                              )}`,
                          )
                        : yupSchema
                }),
        }),
    })
}

export const refIdentifierCreateTemplateUriSchema = (
    t: TFunction<'translation', undefined, 'translation'>,
    language: string,
    formDefaultValues: ConfigurationItemUiAttributes,
    attributes: Attribute[] | undefined,
) => {
    return object().shape({
        [RefTemplateUriFormTypeEnum.OWNER]: string().required(t('validation.required')),
        [RefTemplateUriFormTypeEnum.TEMPLATE_URI]: string().required(t('validation.required')),
        attributes: object().shape({
            [ATTRIBUTE_NAME.Gen_Profil_nazov]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_nazov))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
            [ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
            [ATTRIBUTE_NAME.Gen_Profil_popis]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_popis))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
            [ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
            [ATTRIBUTE_NAME.Profil_Individuum_kod]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_Individuum_kod))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
            [ATTRIBUTE_NAME.Profil_Individuum_platne_od]: date()
                .typeError(t('validation.required'))
                .when('isRequired', (_, current) => {
                    if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_Individuum_platne_od))) {
                        return current.required(t('validation.required'))
                    }
                    return current
                })
                .transform((curr, orig) => (orig === '' ? null : curr))
                .min(
                    getCurrentDateValueToCompare(formDefaultValues, ATTRIBUTE_NAME.Profil_Individuum_platne_od),
                    `${t('validation.dateMustBeEqualOrGreaterThen')} ${formatDateForDefaultValue(
                        getCurrentDateValueToCompare(formDefaultValues, ATTRIBUTE_NAME.Profil_Individuum_platne_od).toString(),
                        'dd.MM.yyyy',
                    )}`,
                ),
            [ATTRIBUTE_NAME.Profil_Individuum_platne_do]: date()
                .nullable()
                .transform((curr, orig) => (orig === '' ? null : curr))
                .when('isRequired', (_, current) => {
                    if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_Individuum_platne_do))) {
                        return current.required(t('validation.required'))
                    }
                    return current
                })
                .when(ATTRIBUTE_NAME.Profil_Individuum_platne_od, (from, yupSchema) => {
                    return DateTime.fromJSDate(new Date(`${from}`)).isValid
                        ? yupSchema.min(
                              from,
                              `${t('validation.dateMustBeGreaterThen')} ${getNameByAttribute(
                                  language,
                                  attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_Individuum_platne_od),
                              )}`,
                          )
                        : yupSchema
                }),
        }),
    })
}

export const refIdentifierCreateDataItemSchema = (
    t: TFunction<'translation', undefined, 'translation'>,
    language: string,
    formDefaultValues: ConfigurationItemUiAttributes,
    attributes: Attribute[] | undefined,
) => {
    return object().shape({
        [RefDataItemFormTypeEnum.OWNER]: string().required(t('validation.required')),
        [RefDataItemFormTypeEnum.PO]: string().required(t('validation.required')),
        [RefDataItemFormTypeEnum.DATA_ITEM]: array()
            .of(string().min(1).required(t('validation.required')))
            .required(t('validation.required')),
        attributes: object().shape({
            [ATTRIBUTE_NAME.Gen_Profil_nazov]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_nazov))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
            [ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
            [ATTRIBUTE_NAME.Gen_Profil_popis]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_popis))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
            [ATTRIBUTE_NAME.Profil_DatovyPrvok_kod_datoveho_prvku]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_kod_datoveho_prvku))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
            [ATTRIBUTE_NAME.Profil_DatovyPrvok_typ_datoveho_prvku]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_typ_datoveho_prvku))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
            [ATTRIBUTE_NAME.Profil_DatovyPrvok_historicky_kod]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_historicky_kod))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
            [ATTRIBUTE_NAME.Profil_DatovyPrvok_zaciatok_ucinnosti]: date()
                .typeError(t('validation.required'))
                .transform((curr, orig) => (orig === '' ? null : curr))
                .when('isRequired', (_, current) => {
                    if (
                        getRequiredByAttribute(
                            attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_zaciatok_ucinnosti),
                        )
                    ) {
                        return current.required(t('validation.required'))
                    }
                    return current
                })
                .min(
                    getCurrentDateValueToCompare(formDefaultValues, ATTRIBUTE_NAME.Profil_DatovyPrvok_zaciatok_ucinnosti),
                    `${t('validation.dateMustBeEqualOrGreaterThen')} ${formatDateForDefaultValue(
                        getCurrentDateValueToCompare(formDefaultValues, ATTRIBUTE_NAME.Profil_DatovyPrvok_zaciatok_ucinnosti).toString(),
                        'dd.MM.yyyy',
                    )}`,
                ),
            [ATTRIBUTE_NAME.Profil_DatovyPrvok_koniec_ucinnosti]: date()
                .nullable()
                .transform((curr, orig) => (orig === '' ? null : curr))
                .when('isRequired', (_, current) => {
                    if (
                        getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_koniec_ucinnosti))
                    ) {
                        return current.required(t('validation.required'))
                    }
                    return current
                })
                .when(ATTRIBUTE_NAME.Profil_DatovyPrvok_zaciatok_ucinnosti, (from, yupSchema) => {
                    return DateTime.fromJSDate(new Date(`${from}`)).isValid
                        ? yupSchema.min(
                              from,
                              `${t('validation.dateMustBeGreaterThen')} ${getNameByAttribute(
                                  language,
                                  attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_zaciatok_ucinnosti),
                              )}`,
                          )
                        : yupSchema
                }),
        }),
    })
}

export const refIdentifierCreateDatasetSchema = (t: TFunction<'translation', undefined, 'translation'>, attributes: Attribute[] | undefined) => {
    return object().shape({
        [RefDatasetFormTypeEnum.OWNER]: string().required(t('validation.required')),
        [RefDatasetFormTypeEnum.DATA_ITEM]: string().required(t('validation.required')),
        [RefDatasetFormTypeEnum.DATA_CODE]: string().required(t('validation.required')),
        attributes: object().shape({
            [ATTRIBUTE_NAME.Gen_Profil_nazov]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_nazov))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
            [ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
            [ATTRIBUTE_NAME.Gen_Profil_popis]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_popis))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
            [ATTRIBUTE_NAME.Profil_URIDataset_uri_datasetu]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIDataset_uri_datasetu))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
            [ATTRIBUTE_NAME.Profil_URIDataset_historicky_kod]: string().when('isRequired', (_, current) => {
                if (getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIDataset_historicky_kod))) {
                    return current.required(t('validation.required'))
                }
                return current
            }),
        }),
    })
}
