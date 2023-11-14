import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_KRIS_TARGET_URL
export const useKRISSwaggerClient = <T>() => useCustomClient<T>(baseURL)
