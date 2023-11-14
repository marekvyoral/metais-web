import { GROUP_ROLES, KSISVS_ROLES } from '@isdd/metais-common/constants'

export const DEFAULT_KSISVS_ROLES = [
    { id: 1, value: 'Predseda KS ISVS', code: KSISVS_ROLES.STD_KSPRE, description: 'STD_KSPRE', valid: true },
    { id: 2, value: 'Podpredseda KS ISVS', code: KSISVS_ROLES.STD_KSPODP, description: 'STD_KSPODP', valid: true },
    { id: 3, value: 'Tajomník KS ISVS', code: KSISVS_ROLES.STD_KSTAJ, description: 'STD_KSTAJ', valid: true },
    { id: 4, value: 'Člen KS ISVS', code: KSISVS_ROLES.STD_KSCLEN, description: 'STD_KSCLEN', valid: true },
    { id: 5, value: 'Prizvaná osoba', code: GROUP_ROLES.STD_PSPO, description: 'STD_PSPO', valid: true },
    { id: 6, value: 'Poverený zastupovaním člena PS', code: GROUP_ROLES.STD_PSZAST, description: 'STD_PSZAST', valid: true },
]

export const DEFAULT_ROLES = [
    { id: 1, value: 'Predseda PS', code: GROUP_ROLES.STD_PSPRE, description: 'STD_PSPRE', valid: true },
    { id: 2, value: 'Podpredseda PS', code: GROUP_ROLES.STD_PSPODP, description: 'STD_PSPODP', valid: true },
    { id: 3, value: 'Člen PS', code: GROUP_ROLES.STD_PSCLEN, description: 'STD_PSCLEN', valid: true },
    { id: 4, value: 'Prizvaná osoba', code: GROUP_ROLES.STD_PSPO, description: 'STD_PSPO', valid: true },
    { id: 5, value: 'Poverený zastupovaním člena PS', code: GROUP_ROLES.STD_PSZAST, description: 'STD_PSZAST', valid: true },
]
