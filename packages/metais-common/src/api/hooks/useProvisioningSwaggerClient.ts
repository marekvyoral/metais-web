import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_PROVISIONING_TARGET_URL
export const useProvisioningSwaggerClient = <T>() => useCustomClient<T>(baseURL)
