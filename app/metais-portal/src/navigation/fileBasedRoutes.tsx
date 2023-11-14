import { globRoutes } from '@isdd/metais-common/fileBasedRouting'

const globExports = import.meta.glob('../pages/**/*.tsx', { eager: true }) ?? {}

export const computedRoutes = () => globRoutes(globExports)
