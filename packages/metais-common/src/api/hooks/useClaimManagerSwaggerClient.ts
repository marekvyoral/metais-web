import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_CLAIM_MANAGER_TARGET_URL
export const useClaimManagerSwaggerClient = <T>() => useCustomClient<T>(baseURL)
