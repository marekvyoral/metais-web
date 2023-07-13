import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_IMPEXP_CMDB_SWAGGER_URL
export const useImpexpCmdbSwaggerClient = <T>() => useCustomClient<T>(baseURL)
