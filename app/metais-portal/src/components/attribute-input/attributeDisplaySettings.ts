import styles from '../create-entity/createEntity.module.scss'

export enum AttributesConfigTechNames {
    METAIS_CODE = 'Gen_Profil_kod_metais',
    REFERENCE_ID = 'Gen_Profil_ref_id',
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
    },
}
