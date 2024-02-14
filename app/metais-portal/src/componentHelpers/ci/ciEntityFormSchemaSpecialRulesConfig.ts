import { formatDateForDefaultValue } from '@isdd/metais-common/componentHelpers/formatting/formatDateUtils'
import { ENTITY_KRIS, ENTITY_OSOBITNY_POSTUP, ENTITY_PROJECT, ENTITY_TRAINING } from '@isdd/metais-common/constants'
import { TFunction } from 'i18next'
import { DateTime } from 'luxon'
import * as yup from 'yup'

const today = new Date(new Date().setHours(0, 0, 0, 0))

interface IRulesProps {
    required?: boolean
    t: TFunction<'translation', undefined, 'translation'>
}

interface ISpecialRulesConfig {
    [key: string]: {
        entityName: string
        rule: yup.DateSchema<Date | undefined | null, yup.AnyObject, undefined, ''>
    }
}

export const specialRulesConfig = ({ required, t }: IRulesProps): ISpecialRulesConfig => ({
    Profil_KRIS_datum_vypracovania: {
        entityName: ENTITY_KRIS,
        rule: yup.date().when('isRequired', {
            is: () => required,
            then: () =>
                yup
                    .date()
                    .required(t('validation.required'))
                    .transform((curr, orig) => (orig === '' ? null : curr))
                    .max(today, `${t('validation.dateMustBeLessOrEqualThen')} ${formatDateForDefaultValue(today.toString(), 'dd.MM.yyyy')}`),
            otherwise: () =>
                yup
                    .date()
                    .nullable()
                    .transform((curr, orig) => (orig === '' ? null : curr))
                    .max(today, `${t('validation.dateMustBeLessOrEqualThen')} ${formatDateForDefaultValue(today.toString(), 'dd.MM.yyyy')}`),
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
                    .max(today, `${t('validation.dateMustBeLessOrEqualThen')} ${formatDateForDefaultValue(today.toString(), 'dd.MM.yyyy')}`),
            otherwise: () =>
                yup
                    .date()
                    .nullable()
                    .transform((curr, orig) => (orig === '' ? null : curr))
                    .max(today, `${t('validation.dateMustBeLessOrEqualThen')} ${formatDateForDefaultValue(today.toString(), 'dd.MM.yyyy')}`),
        }),
    },
    Profil_Skolenie_zaciatok: {
        entityName: ENTITY_TRAINING,
        rule: yup
            .date()
            .typeError(t('validation.required'))
            .required(t('validation.required'))
            .min(today, `${t('validation.dateMustBeEqualOrGreaterThen')} ${formatDateForDefaultValue(today.toString(), 'dd.MM.yyyy')}`),
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
            .min(today, `${t('validation.dateMustBeEqualOrGreaterThen')} ${formatDateForDefaultValue(today.toString(), 'dd.MM.yyyy')}`),
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
})

interface IGetRuleProps {
    technicalName: string
    entityName?: string
    required?: boolean
    t: TFunction<'translation', undefined, 'translation'>
}

export const getSpecialRule = ({ technicalName, entityName, required, t }: IGetRuleProps) => {
    if (!entityName) {
        return
    }
    const ruleConfig = specialRulesConfig({ required, t })[technicalName]
    return ruleConfig?.entityName === entityName ? ruleConfig.rule : undefined
}
