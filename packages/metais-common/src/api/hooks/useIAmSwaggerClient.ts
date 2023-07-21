import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_ADMIN_IAM_TARGET_URL
export const useIAmSwaggerClient = <T>() => useCustomClient<T>(baseURL)
