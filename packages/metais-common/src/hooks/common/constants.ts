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
