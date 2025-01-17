import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_DMS_BASE_URL
export const useDmsSwaggerClient = <T>() => useCustomClient<T>(baseURL)
