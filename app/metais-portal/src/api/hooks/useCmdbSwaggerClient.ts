import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_CMDB_BASE_URL
export const useCmdbSwaggerClient = <T>() => useCustomClient<T>(baseURL)
