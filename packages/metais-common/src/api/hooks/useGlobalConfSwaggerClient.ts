import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_GLOBAL_CONF_TARGET_URL
export const useGlobalConfSwaggerClient = <T>() => useCustomClient<T>(baseURL)
