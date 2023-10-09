import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_STANDARDS_TARGET_URL
export const useStandardsSwaggerClient = <T>() => useCustomClient<T>(baseURL)
