import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_TCO_TARGET_URL
export const useTcoSwaggerClient = <T>() => useCustomClient<T>(baseURL)
