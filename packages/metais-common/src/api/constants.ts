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
    MERNA_JEDNOTKA = 'MERNA_JEDNOTKA',
    STAV_ISVS = 'STAV_ISVS',
    TYP_ISVS = 'TYP_ISVS',
    LIVE = 'LIVE',
    DOWN = 'DOWN',
    MAINTENANCE = 'MAINTENANCE',
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
    Gen_Profil_Rel = 'Gen_Profil_Rel',
    EA_Profil_PO_webove_sidlo = 'EA_Profil_PO_webove_sidlo',
    Gen_Profil_poznamka = 'Gen_Profil_poznamka',
    EA_Profil_Rel = 'EA_Profil_Rel',
    EA_Profil_PO_ico = 'EA_Profil_PO_ico',
    EA_Profil_PO_psc = 'EA_Profil_PO_psc',
    EA_Profil_PO_obec = 'EA_Profil_PO_obec',
    EA_Profil_PO_ulica = 'EA_Profil_PO_ulica',
    EA_Profil_PO_cislo = 'EA_Profil_PO_cislo',
    EA_Profil_PO_okres = 'EA_Profil_PO_okres',
    EA_Profil_Projekt_schvalovaci_proces = 'EA_Profil_Projekt_schvalovaci_proces',
    EA_Profil_PO_je_kapitola = 'EA_Profil_PO_je_kapitola',
    EA_Profil_Projekt_status = 'EA_Profil_Projekt_status',
    EA_Profil_Projekt_program = 'EA_Profil_Projekt_program',
    Profil_Rel_FazaZivotnehoCyklu = 'Profil_Rel_FazaZivotnehoCyklu',
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
    ReferenceRegister_Profile_name = 'ReferenceRegister_Profile_name',
    ISVS_Name = 'isvsName',
    Sr_Name = 'srName',
    standardRequestState = 'standardRequestState',
    requestChannel = 'requestChannel',
    createdAt = 'createdAt',
    lastModifiedAt = 'lastModifiedAt',
    name = 'name',
    email = 'email',
    srDescription1 = 'srDescription1',
    relatedDocuments = 'relatedDocuments',
    Profil_KRIS_stav_kris = 'Profil_KRIS_stav_kris',
    Profil_Ciel_kategoria = 'Profil_Ciel_kategoria',
    Profil_KRIS_Zavazok_ciele_principy_stav = 'Profil_KRIS_Zavazok_ciele_principy_stav',
    Gui_Profil_DIZ_konzumujuci_projekt = 'Gui_Profil_DIZ_konzumujuci_projekt',
    Gui_Profil_DIZ_poskytujuci_projekt = 'Gui_Profil_DIZ_poskytujuci_projekt',
    Integracia_Profil_Integracia_stav_diz = 'Integracia_Profil_Integracia_stav_diz',
    Profil_URIKatalog_uri = 'Profil_URIKatalog_uri',
    Profil_URIDataset_uri_datasetu = 'Profil_URIDataset_uri_datasetu',
    Profil_Individuum_zaklad_uri = 'Profil_Individuum_zaklad_uri',
    Profil_Individuum_historicky_kod = 'Profil_Individuum_historicky_kod',
    Profil_URIKatalog_historicky_kod = 'Profil_URIKatalog_historicky_kod',
    Profil_URIDataset_historicky_kod = 'Profil_URIDataset_historicky_kod',
    Profil_DatovyPrvok_historicky_kod = 'Profil_DatovyPrvok_historicky_kod',
    Profil_DatovyPrvok_zaciatok_ucinnosti = 'Profil_DatovyPrvok_zaciatok_ucinnosti',
    Profil_Individuum_platne_od = 'Profil_Individuum_platne_od',
    Profil_URIKatalog_platne_od = 'Profil_URIKatalog_platne_od',
    Profil_URIDataset_platne_od = 'Profil_URIDataset_platne_od',
    Profil_DatovyPrvok_koniec_ucinnosti = 'Profil_DatovyPrvok_koniec_ucinnosti',
    Profil_Individuum_platne_do = 'Profil_Individuum_platne_do',
    Profil_URIKatalog_platne_do = 'Profil_URIKatalog_platne_do',
    Profil_URIDataset_platne_do = 'Profil_URIDataset_platne_do',
    Profil_DatovyPrvok_kod_datoveho_prvku = 'Profil_DatovyPrvok_kod_datoveho_prvku',
    Profil_DatovyPrvok_typ_datoveho_prvku = 'Profil_DatovyPrvok_typ_datoveho_prvku',
    Profil_Individuum_kod = 'Profil_Individuum_kod',
    Profil_Individuum_versions = 'Profil_Individuum_versions',
    Gen_Profil_RefID_stav_registracie = 'Gen_Profil_RefID_stav_registracie',
    Profil_Kontrakt_faza = 'Profil_Kontrakt_faza',
    Profil_Kontrakt_identifikator = 'Profil_Kontrakt_identifikator',
    Profil_Kontrakt_podpora_forma_kontaktu = 'Profil_Kontrakt_podpora_forma_kontaktu',
    Profil_Kontrakt_podpora_forma_kontaktu_mimo_prevadzky = 'Profil_Kontrakt_podpora_forma_kontaktu_mimo_prevadzky',
    Profil_Kontrakt_podpora_prevadzkova_doba = 'Profil_Kontrakt_podpora_prevadzkova_doba',
    Profil_Kontrakt_podpora_instrukcie_kontaktovania = 'Profil_Kontrakt_podpora_instrukcie_kontaktovania',
    Profil_Kontrakt_podpora_max_odozva_mimo_prevadzky = 'Profil_Kontrakt_podpora_max_odozva_mimo_prevadzky',
    Profil_Kontrakt_podpora_max_odozva_pocas_prevadzky = 'Profil_Kontrakt_podpora_max_odozva_pocas_prevadzky',
    Profil_Skolenie_pocet_volnych_miest = 'Profil_Skolenie_pocet_volnych_miest',
    Profil_Skolenie_pocet_miest = 'Profil_Skolenie_pocet_miest',
}

export enum ATTRIBUTE_PROFILE_NAME {
    Profil_KRIS = 'Profil_KRIS',
    Financny_Profil_Projekt = 'Financny_Profil_Projekt',
    Integracia_Profil_Integracia = 'Integracia_Profil_Integracia',
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
    workGroupId = 'workGroupId',
}

export const Gen_Profil = 'Gen_Profil'
export const Gui_Profil_Standardy = 'Gui_Profil_Standardy'

export const Gui_Profil_RR = 'Gui_Profil_RR'
export const Reference_Registers = 'ReferenceRegisters'

export const TYPE_OF_APPROVAL_PROCESS_DEFAULT = 'OPTIONAL_APPROVAL'

export enum APPROVAL_PROCESS {
    OPTIONAL_APPROVAL = 'OPTIONAL_APPROVAL',
    WITHOUT_APPROVAL = 'WITHOUT_APPROVAL',
    MANDATORY_APPROVAL = 'MANDATORY_APPROVAL',
}

export enum PROJECT_STATE_ENUM {
    c_stav_projektu_1 = 'c_stav_projektu_1',
    c_stav_projektu_2 = 'c_stav_projektu_2',
    c_stav_projektu_3 = 'c_stav_projektu_3',
    c_stav_projektu_4 = 'c_stav_projektu_4',
    c_stav_projektu_5 = 'c_stav_projektu_5',
    c_stav_projektu_6 = 'c_stav_projektu_6',
    c_stav_projektu_7 = 'c_stav_projektu_7',
    c_stav_projektu_8 = 'c_stav_projektu_8',
    c_stav_projektu_9 = 'c_stav_projektu_9',
    c_stav_projektu_10 = 'c_stav_projektu_10',
    c_stav_projektu_11 = 'c_stav_projektu_11',
    c_stav_projektu_12 = 'c_stav_projektu_12',
}

export enum STATUTAR_NAME {
    Profil_PO_statutar_titul_pred_menom = 'Profil_PO_statutar_titul_pred_menom',
    Profil_PO_statutar_meno = 'Profil_PO_statutar_meno',
    Profil_PO_statutar_priezvisko = 'Profil_PO_statutar_priezvisko',
    Profil_PO_statutar_titul_za_menom = 'Profil_PO_statutar_titul_za_menom',
}
export const TOP_LEVEL_PO_ICO = '000000003001'

export const MEASURE_UNIT = 'MERNA_JEDNOTKA'

export enum COOKIES_TYPES {
    NECESSARILY_COOKIES_CONSENT = 'necessarily_cookies_consent',
    ANALYTICALLY_COOKIES_CONSENT = 'analytically_cookies_consent',
    PREFERENTIAL_COOKIES_CONSENT = 'preferential_cookies_consent',
}

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

export enum Roles {
    SZC_HLGES = 'SZC_HLGES',
    SZC_VEDGES = 'SZC_VEDGES',
}

export const SlaViewOptions = [
    { value: 'true', label: 'Len aktívne záznamy' },
    { value: 'false', label: 'Všetky záznamy' },
]

export const TYP_HODNOTY = 'TYP_HODNOTY'
export const TYP_PARAMETROV_JEDNOTKA = 'TYP_PARAMETROV_JEDNOTKA'

export const SYSTEM_STATE = 'SYSTEM_STATE'
export const SYSTEM_STATE_COLOR = 'SYSTEM_STATE_COLOR'
export const SHOW_SYSTEM_STATE_BAR = 'show-system-state-bar'

export enum RELATION_TYPE {
    URIDataset_patri_URIKatalog = 'URIDataset_patri_URIKatalog',
    DatovyPrvok_sa_sklada_DatovyPrvok = 'DatovyPrvok_sa_sklada_DatovyPrvok',
    Individuum_je_typu_DatovyPrvok = 'Individuum_je_typu_DatovyPrvok',
    URIDataset_definuje_uri_ZC = 'URIDataset_definuje_uri_ZC',
    URIDataset_obsahuje_DatovyPrvok = 'URIDataset_obsahuje_DatovyPrvok',
    PO_je_gestor_DatovyPrvok = 'PO_je_gestor_DatovyPrvok',
    PO_je_gestor_URIKatalog = 'PO_je_gestor_URIKatalog',
}

export enum RefIdentifierTypeEnum {
    Individuum = 'Individuum',
    URIKatalog = 'URIKatalog',
    DatovyPrvok = 'DatovyPrvok',
    URIDataset = 'URIDataset',
}

export enum EntityColorEnum {
    customEntity = '#dfdfdf',
    systemEntity = '#ffe4af',
    businessLayer = '#ffffaf',
    appAndDataLayer = '#afffff',
    technologicalLayer = '#afffaf',
    implementationAndMigration = '#ffe0e0',
    implementationAndMigration2 = '#e0ffe0',
    motivationalEntity = '#ffccff',
    motivationalEntity2 = '#ccccff',
}

export const EntityColorEnumTranslateKeys = {
    [EntityColorEnum.customEntity]: 'customEntity',
    [EntityColorEnum.systemEntity]: 'systemEntity',
    [EntityColorEnum.businessLayer]: 'businessLayer',
    [EntityColorEnum.appAndDataLayer]: 'appAndDataLayer',
    [EntityColorEnum.technologicalLayer]: 'technologicalLayer',
    [EntityColorEnum.implementationAndMigration]: 'implementationAndMigration',
    [EntityColorEnum.implementationAndMigration2]: 'implementationAndMigration',
    [EntityColorEnum.motivationalEntity]: 'motivationalEntity',
    [EntityColorEnum.motivationalEntity2]: 'motivationalEntity',
}
