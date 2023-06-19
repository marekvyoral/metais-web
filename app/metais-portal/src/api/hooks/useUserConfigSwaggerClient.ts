import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_USER_CONFIG_REPO_BASE_URL
export const useUserConfigSwaggerClient = <T>() => useCustomClient<T>(baseURL)
