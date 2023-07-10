import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_BASE_URL
export const useUserConfigSwaggerClient = <T>() => useCustomClient<T>(baseURL)
