import { formatDateForDefaultValue } from '@isdd/metais-common/componentHelpers/formatting/formatDateUtils'
import { ENTITY_KRIS, ENTITY_OSOBITNY_POSTUP, ENTITY_PROJECT, ENTITY_TRAINING, KS_MA_FAZU_ZIVOTNEHO_CYKLU } from '@isdd/metais-common/constants'
import { TFunction } from 'i18next'
import { DateTime } from 'luxon'
import * as yup from 'yup'

const midNight = new Date(new Date().setHours(0, 0, 0, 0))

interface IRulesProps {
    required?: boolean
    t: TFunction<'translation', undefined, 'translation'>
    currentValue?: string
}

interface ISpecialRulesConfig {
    [key: string]: {
        entityName: string
        rule: yup.DateSchema<Date | undefined | null, yup.AnyObject, undefined, ''>
    }
}

export const specialRulesConfig = ({ required, t, currentValue }: IRulesProps): ISpecialRulesConfig => {
    const isCurrentValueSmallerThanActualDate =
        currentValue && DateTime.fromJSDate(new Date(currentValue)).isValid && new Date(currentValue).getTime() < new Date().getTime() ? true : false
    const currentDateValueToCompare = isCurrentValueSmallerThanActualDate ? currentValue ?? new Date() : new Date()
    const midnightValueToCompare = isCurrentValueSmallerThanActualDate ? currentValue ?? midNight : midNight

    return {
        Profil_KRIS_datum_vypracovania: {
            entityName: ENTITY_KRIS,
            rule: yup.date().when('isRequired', {
                is: () => required,
                then: () =>
                    yup
                        .date()
                        .required(t('validation.required'))
                        .transform((curr, orig) => (orig === '' ? null : curr))
                        .max(
                            midNight,
                            `${t('validation.dateMustBeLessOrEqualThen')} ${formatDateForDefaultValue(midNight.toString(), 'dd.MM.yyyy')}`,
                        ),
                otherwise: () =>
                    yup
                        .date()
                        .nullable()
                        .transform((curr, orig) => (orig === '' ? null : curr))
                        .max(
                            midNight,
                            `${t('validation.dateMustBeLessOrEqualThen')} ${formatDateForDefaultValue(midNight.toString(), 'dd.MM.yyyy')}`,
                        ),
            }),
        },
        Profil_KRIS_datum_schvalenia: {
            entityName: ENTITY_KRIS,
            rule: yup.date().when('isRequired', {
                is: () => required,
                then: () =>
                    yup
                        .date()
                        .required(t('validation.required'))
                        .transform((curr, orig) => (orig === '' ? null : curr))
                        .max(
                            midNight,
                            `${t('validation.dateMustBeLessOrEqualThen')} ${formatDateForDefaultValue(midNight.toString(), 'dd.MM.yyyy')}`,
                        ),
                otherwise: () =>
                    yup
                        .date()
                        .nullable()
                        .transform((curr, orig) => (orig === '' ? null : curr))
                        .max(
                            midNight,
                            `${t('validation.dateMustBeLessOrEqualThen')} ${formatDateForDefaultValue(midNight.toString(), 'dd.MM.yyyy')}`,
                        ),
            }),
        },
        Profil_Skolenie_zaciatok: {
            entityName: ENTITY_TRAINING,
            rule: yup
                .date()
                .typeError(t('validation.required'))
                .required(t('validation.required'))
                .min(
                    currentDateValueToCompare,
                    `${t('validation.dateMustBeEqualOrGreaterThen')} ${formatDateForDefaultValue(
                        currentDateValueToCompare.toString(),
                        'dd.MM.yyyy HH:mm',
                    )}`,
                ),
        },
        Profil_Skolenie_koniec: {
            entityName: ENTITY_TRAINING,
            rule: yup
                .date()
                .typeError(t('validation.required'))
                .required(t('validation.required'))
                .when('Profil_Skolenie_zaciatok', (trainingFrom, yupSchema) => {
                    return DateTime.fromJSDate(new Date(`${trainingFrom}`)).isValid
                        ? yupSchema.min(trainingFrom, `${t('validation.dateMustBeGreaterThen')} ${t('trainings.from')}`)
                        : yupSchema
                }),
        },
        Profil_Osobitny_Postup_datum_ucinnosti_od: {
            entityName: ENTITY_OSOBITNY_POSTUP,
            rule: yup
                .date()
                .nullable()
                .transform((curr, orig) => (orig === '' ? null : curr))
                .min(
                    midnightValueToCompare,
                    `${t('validation.dateMustBeEqualOrGreaterThen')} ${formatDateForDefaultValue(midnightValueToCompare.toString(), 'dd.MM.yyyy')}`,
                ),
        },
        Profil_Osobitny_Postup_datum_ucinnosti_do: {
            entityName: ENTITY_OSOBITNY_POSTUP,
            rule: yup
                .date()
                .nullable()
                .transform((curr, orig) => (orig === '' ? null : curr))
                .when('Profil_Osobitny_Postup_datum_ucinnosti_od', (osobitnyPostupOd, yupSchema) => {
                    return DateTime.fromJSDate(new Date(`${osobitnyPostupOd}`)).isValid
                        ? yupSchema.min(osobitnyPostupOd, `${t('validation.dateMustBeGreaterThen')} ${t('form.specialRule.osobitnyPostupDateFrom')}`)
                        : yupSchema
                }),
        },
        Profil_Rel_FazaZivotnehoCyklu_datum_ukoncenia: {
            entityName: KS_MA_FAZU_ZIVOTNEHO_CYKLU,
            rule: yup
                .date()
                .nullable()
                .transform((curr, orig) => (orig === '' ? null : curr))
                .when('Profil_Rel_FazaZivotnehoCyklu_datum_zacatia', (FazaZivotnehoCykluOd, yupSchema) => {
                    return DateTime.fromJSDate(new Date(`${FazaZivotnehoCykluOd}`)).isValid
                        ? yupSchema.min(
                              FazaZivotnehoCykluOd,
                              `${t('validation.dateMustBeGreaterThen')} ${t('form.specialRule.osobitnyPostupDateFrom')}`,
                          )
                        : yupSchema
                }),
        },
        EA_Profil_Projekt_termin_ukoncenia: {
            entityName: ENTITY_PROJECT,
            rule: yup
                .date()
                .typeError(t('validation.required'))
                .required(t('validation.required'))
                .when('EA_Profil_Projekt_datum_zacatia', (projectStart, yupSchema) => {
                    return DateTime.fromJSDate(new Date(`${projectStart}`)).isValid
                        ? yupSchema.min(projectStart, `${t('validation.dateMustBeGreaterThen')} ${t('form.specialRule.projectImplementationStart')}`)
                        : yupSchema
                }),
        },
    }
}

interface IGetRuleProps {
    technicalName: string
    entityName?: string
    required?: boolean
    t: TFunction<'translation', undefined, 'translation'>
    currentValue?: string
}

export const getSpecialRule = ({ technicalName, entityName, required, t, currentValue }: IGetRuleProps) => {
    if (!entityName) {
        return
    }
    const ruleConfig = specialRulesConfig({ required, t, currentValue })[technicalName]
    return ruleConfig?.entityName === entityName ? ruleConfig.rule : undefined
}
