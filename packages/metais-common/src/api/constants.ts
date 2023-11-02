export const BASE_PAGE_NUMBER = 1
export const BASE_PAGE_SIZE = 10
export const urlBase = 'https://metais.vicepremier.gov.sk'
export const DMS_DOWNLOAD_FILE = `${import.meta.env.VITE_REST_CLIENT_DMS_TARGET_URL}/file/`
export const DMS_DOWNLOAD_BASE = `${import.meta.env.VITE_REST_CLIENT_DMS_TARGET_URL}/file`

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
    EA_Profil_Projekt_schvalovaci_proces = 'EA_Profil_Projekt_schvalovaci_proces',
    EA_Profil_PO_je_kapitola = 'EA_Profil_PO_je_kapitola',
    EA_Profil_Projekt_status = 'EA_Profil_Projekt_status',
    IKT_Profil_Schvalenie_stav_migracie = 'IKT_Profil_Schvalenie_stav_migracie',
    Financny_Profil_Projekt_schvalene_rocne_naklady = 'Financny_Profil_Projekt_schvalene_rocne_naklady',
    Financny_Profil_Projekt_schvaleny_rozpocet = 'Financny_Profil_Projekt_schvaleny_rozpocet',
    Gen_Profil_EA_skrateny_nazov = 'Gen_Profil_EA_skrateny_nazov',
    Gen_Profil_EA_popis_referencie = 'Gen_Profil_EA_popis_referencie',
    Gen_Profil_EA_odkaz_na_referenciu = 'Gen_Profil_EA_odkaz_na_referenciu',
    Gen_Profil_EA_typ_replikacie = 'Gen_Profil_EA_typ_replikacie',
    Gen_Profil_EA_pocet_replikacii = 'Gen_Profil_EA_pocet_replikacii',
    ReferenceRegisterHistory_Profile_stav = 'ReferenceRegisterHistory_Profile_stav',
    ReferenceRegisterHistory_Profile_popis = 'ReferenceRegisterHistory_Profile_popis',
    ReferenceRegisterHistory_Profile_prilohy = 'ReferenceRegisterHistory_Profile_prilohy',
    ISVS_Name = 'isvsName',
}

export const Gen_Profil = 'Gen_Profil'
export const Gui_Profil_RR = 'Gui_Profil_RR'
export const Reference_Registers = 'ReferenceRegisters'

export const TYPE_OF_APPROVAL_PROCESS_DEFAULT = 'OPTIONAL_APPROVAL'

export enum APPROVAL_PROCESS {
    OPTIONAL_APPROVAL = 'OPTIONAL_APPROVAL',
    WITHOUT_APPROVAL = 'WITHOUT_APPROVAL',
}

export enum PROJECT_STATE_ENUM {
    c_stav_projektu_1 = 'c_stav_projektu_1',
    c_stav_projektu_2 = 'c_stav_projektu_1',
    c_stav_projektu_3 = 'c_stav_projektu_1',
    c_stav_projektu_4 = 'c_stav_projektu_1',
    c_stav_projektu_5 = 'c_stav_projektu_1',
    c_stav_projektu_6 = 'c_stav_projektu_1',
    c_stav_projektu_7 = 'c_stav_projektu_1',
    c_stav_projektu_8 = 'c_stav_projektu_1',
    c_stav_projektu_9 = 'c_stav_projektu_1',
    c_stav_projektu_10 = 'c_stav_projektu_1',
    c_stav_projektu_11 = 'c_stav_projektu_1',
}

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

export enum QueryKeysByEntity {
    REFERENCE_REGISTER = 'referenceRegisterData',
}
