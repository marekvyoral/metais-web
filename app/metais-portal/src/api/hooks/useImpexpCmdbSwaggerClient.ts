import { useCustomClient } from './use-custom-client'
const baseURL = 'http://impexpcmdb-metais3.apps.dev.isdd.sk/export'
export const useImpexpCmdbSwaggerClient = <T>() => useCustomClient<T>(baseURL)
