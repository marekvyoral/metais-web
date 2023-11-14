import * as yup from 'yup'
import { TFunction } from 'i18next'

export const generateCreatePublicAuthoritiesSchema = (t: TFunction<'translation', undefined, 'translation'>) => {
    return yup.object().shape(
        {
            Gen_Profil_nazov: yup.string().required(t('egov.create.requiredField')),
            EA_Profil_PO_kategoria_osoby: yup.string().required(t('egov.create.requiredField')),
            EA_Profil_PO_typ_osoby: yup
                .string()
                .when('EA_Profil_PO_kategoria_osoby', {
                    is: (val: string) => val == 'c_kategoria_osoba.2',
                    then: () => yup.string().required(t('egov.create.requiredField')),
                    otherwise: () => yup.string().notRequired(),
                })
                .required(),
            Gen_Profil_anglicky_nazov: yup.string(),
            Gen_Profil_popis: yup.string(),
            Gen_Profil_anglicky_popis: yup.string(),
            Gen_Profil_zdroj: yup.string(),
            Gen_Profil_kod_metais: yup.string(),
            Gen_Profil_ref_id: yup.string(),
            EA_Profil_PO_webove_sidlo: yup.string(),
            Gen_Profil_poznamka: yup.string(),
            EA_Profil_PO_ico: yup.string(),
            EA_Profil_PO_psc: yup.string().when('EA_Profil_PO_psc', {
                is: (val: string) => val !== '',
                then: () => yup.string().matches(/\b\d{5}\b/gm, t('publicAuthorities.create.postalCodeRegex')),
                otherwise: () => yup.string(),
            }),
            EA_Profil_PO_obec: yup.string(),
            EA_Profil_PO_ulica: yup.string(),
            EA_Profil_PO_cislo: yup.string(),
            EA_Profil_PO_okres: yup.string(),
            EA_Profil_PO_je_kapitola: yup.boolean(),
            Gen_Profil_EA_skrateny_nazov: yup.string(),
            Gen_Profil_EA_popis_referencie: yup.string(),
            Gen_Profil_EA_odkaz_na_referenciu: yup.string(),
            Gen_Profil_EA_typ_replikacie: yup.string(),
            Gen_Profil_EA_pocet_replikacii: yup.string(),
            Profil_PO_statutar_titul_pred_menom: yup.string(),
            Profil_PO_statutar_meno: yup.string(),
            Profil_PO_statutar_priezvisko: yup.string(),
            Profil_PO_statutar_titul_za_menom: yup.string(),
        },
        [
            ['EA_Profil_PO_psc', 'EA_Profil_PO_psc'],
            ['Gen_Profil_EA_pocet_replikacii', 'Gen_Profil_EA_pocet_replikacii'],
        ],
    )
}
