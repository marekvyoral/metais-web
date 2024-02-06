import styles from '../create-entity/createEntity.module.scss'

export enum AttributesConfigTechNames {
    METAIS_CODE = 'Gen_Profil_kod_metais',
    REFERENCE_ID = 'Gen_Profil_ref_id',
    EFF_DATE_FROM = 'Profil_Osobitny_Postup_datum_ucinnosti_od',
    EFF_DATE_TO = 'Profil_Osobitny_Postup_datum_ucinnosti_do',
    EA_Profil_Projekt_prijimatel = 'EA_Profil_Projekt_prijimatel',
}

interface AttConfig {
    attributes: {
        [key: string]: {
            className: string
        }
    }
}

export const attClassNameConfig: AttConfig = {
    attributes: {
        [AttributesConfigTechNames.METAIS_CODE]: {
            className: styles.halfWidth,
        },
        [AttributesConfigTechNames.REFERENCE_ID]: {
            className: styles.halfWidth,
        },
        [AttributesConfigTechNames.EFF_DATE_FROM]: {
            className: styles.halfWidth,
        },
        [AttributesConfigTechNames.EFF_DATE_TO]: {
            className: styles.halfWidth,
        },
    },
}
