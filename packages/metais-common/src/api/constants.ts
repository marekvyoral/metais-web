export const BASE_PAGE_NUMBER = 1
export const BASE_PAGE_SIZE = 10
export const urlBase = 'https://metais.vicepremier.gov.sk'
export const DMS_DOWNLOAD_FILE = `${import.meta.env.VITE_REST_CLIENT_DMS_TARGET_URL}/file/`

export enum GET_ENUM {
    KATEGORIA_OSOBA = 'KATEGORIA_OSOBA',
    TYP_OSOBY = 'TYP_OSOBY',
    ZDROJ = 'ZDROJ',
    TYP_REPLIKACIE = 'TYP_REPLIKACIE',
}

export enum ATTRIBUTE_NAME {
    Gen_Profil_nazov = 'Gen_Profil_nazov',
    EA_Profil_PO_kategoria_osoby = 'EA_Profil_PO_kategoria_osoby',
    EA_Profil_PO_typ_osoby = 'EA_Profil_PO_typ_osoby',
    Gen_Profil_anglicky_nazov = 'Gen_Profil_anglicky_nazov',
    Gen_Profil_popis = 'Gen_Profil_popis',
    Gen_Profil_anglicky_popis = 'Gen_Profil_anglicky_popis',
    Gen_Profil_zdroj = 'Gen_Profil_zdroj',
    Gen_Profil_kod_metais = 'Gen_Profil_kod_metais',
    Gen_Profil_ref_id = 'Gen_Profil_ref_id',
    EA_Profil_PO_webove_sidlo = 'EA_Profil_PO_webove_sidlo',
    Gen_Profil_poznamka = 'Gen_Profil_poznamka',
    EA_Profil_PO_ico = 'EA_Profil_PO_ico',
    EA_Profil_PO_psc = 'EA_Profil_PO_psc',
    EA_Profil_PO_obec = 'EA_Profil_PO_obec',
    EA_Profil_PO_ulica = 'EA_Profil_PO_ulica',
    EA_Profil_PO_cislo = 'EA_Profil_PO_cislo',
    EA_Profil_PO_okres = 'EA_Profil_PO_okres',
    EA_Profil_PO_je_kapitola = 'EA_Profil_PO_je_kapitola',
    Gen_Profil_EA_skrateny_nazov = 'Gen_Profil_EA_skrateny_nazov',
    Gen_Profil_EA_popis_referencie = 'Gen_Profil_EA_popis_referencie',
    Gen_Profil_EA_odkaz_na_referenciu = 'Gen_Profil_EA_odkaz_na_referenciu',
    Gen_Profil_EA_typ_replikacie = 'Gen_Profil_EA_typ_replikacie',
    Gen_Profil_EA_pocet_replikacii = 'Gen_Profil_EA_pocet_replikacii',
    ReferenceRegisterHistory_Profile_stav = 'ReferenceRegisterHistory_Profile_stav',
    ReferenceRegisterHistory_Profile_popis = 'ReferenceRegisterHistory_Profile_popis',
    ReferenceRegisterHistory_Profile_prilohy = 'ReferenceRegisterHistory_Profile_prilohy',
    ISVS_Name = 'isvsName',
    Sr_Name = 'srName',
    standardRequestState = 'standardRequestState',
    requestChannel = 'requestChannel',
    createdAt = 'createdAt',
    name = 'name',
    email = 'email',
    srDescription1 = 'srDescription1',
    relatedDocuments = 'relatedDocuments',
}

export enum API_STANDARD_REQUEST_ATTRIBUTES {
    srName = 'srName',
    adaptabilityDescription1 = 'adaptabilityDescription1',
    adaptabilityDescription2 = 'adaptabilityDescription2',
    applicabilityDescription1 = 'applicabilityDescription1',
    applicabilityDescription2 = 'applicabilityDescription2',
    applicabilityDescription3 = 'applicabilityDescription3',
    applicabilityDescription4 = 'applicabilityDescription4',
    expandabilityDescription1 = 'expandabilityDescription1',
    expandabilityDescription2 = 'expandabilityDescription2',
    extensionDescription1 = 'extensionDescription1',
    extensionDescription2 = 'extensionDescription2',
    extensionDescription3 = 'extensionDescription3',
    extensionDescription4 = 'extensionDescription4',
    extensionDescription5 = 'extensionDescription5',
    extensionDescription6 = 'extensionDescription6',
    extensionDescription7 = 'extensionDescription7',
    impactDescription1 = 'impactDescription1',
    impactDescription2 = 'impactDescription2',
    impactDescription3 = 'impactDescription3',
    impactDescription4 = 'impactDescription4',
    impactDescription5 = 'impactDescription5',
    impactDescription6 = 'impactDescription6',
    impactDescription7 = 'impactDescription7',
    impactDescription8 = 'impactDescription8',
    impactDescription9 = 'impactDescription9',
    impactDescription10 = 'impactDescription10',
    impactDescription11 = 'impactDescription11',
    impactDescription12 = 'impactDescription12',
    maintenanceDescription1 = 'maintenanceDescription1',
    maturityDescription1 = 'maturityDescription1',
    maturityDescription2 = 'maturityDescription2',
    maturityDescription3 = 'maturityDescription3',
    outputsDescription1 = 'outputsDescription1',
    outputsDescription2 = 'outputsDescription2',
    outputsDescription3 = 'outputsDescription3',
    outputsDescription4 = 'outputsDescription4',
    outputsDescription5 = 'outputsDescription5',
    processDescription1 = 'processDescription1',
    processDescription2 = 'processDescription2',
    processDescription3 = 'processDescription3',
    processDescription4 = 'processDescription4',
    processDescription5 = 'processDescription5',
    processDescription6 = 'processDescription6',
    proposalDescription1 = 'proposalDescription1',
    proposalDescription2 = 'proposalDescription2',
    proposalDescription3 = 'proposalDescription3',
    relevanceDescription1 = 'relevanceDescription1',
    reusabilityDescription1 = 'reusabilityDescription1',
    reusabilityDescription2 = 'reusabilityDescription2',
    scalabilityDescription1 = 'scalabilityDescription1',
    stabilityDescription1 = 'stabilityDescription1',
    stabilityDescription2 = 'stabilityDescription2',
    stabilityDescription3 = 'stabilityDescription3',
    srDescription1 = 'srDescription1',
    srDescription2 = 'srDescription2',
    srDescription3 = 'srDescription3',
    srDescription4 = 'srDescription4',
    srDescription5 = 'srDescription5',
    srDescription6 = 'srDescription6',
    actionDesription = 'actionDesription',
}

export const Gen_Profil = 'Gen_Profil'
export const Gui_Profil_Standardy = 'Gui_Profil_Standardy'

export enum STATUTAR_NAME {
    Profil_PO_statutar_titul_pred_menom = 'Profil_PO_statutar_titul_pred_menom',
    Profil_PO_statutar_meno = 'Profil_PO_statutar_meno',
    Profil_PO_statutar_priezvisko = 'Profil_PO_statutar_priezvisko',
    Profil_PO_statutar_titul_za_menom = 'Profil_PO_statutar_titul_za_menom',
}

export const TOP_LEVEL_PO_ICO = '000000003001'

export const MEASURE_UNIT = 'MERNA_JEDNOTKA'

export enum CATEGORY_ENUM {
    NOT_VISIBLE = 'NO',
    READ_ONLY_BDA = 'ROCB',
    READ_ONLY = 'RONCB',
    READ_WRITE = 'RWNCB',
    READ_WRITE_BDA = 'RWCB',
}
export enum TYPES_ENUM {
    SYSTEM = 'system',
}
export const NOT_PUBLIC_ENTITIES = ['MiestoPrevadzky']

export const connectedCiTabsToRemove = [
    'BazaDat',
    'Migracia',
    'Platforma',
    'TP_SietovyPrvok',
    'SystemovySW',
    'TP_SpecTechnologia',
    'TP_Ulozisko',
    'TP_VypoctovyZdroj',
    'TP_Zalohovanie',
]
