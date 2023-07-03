import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_ENUMS_REPO_BASE_URL
export const useEnumsRepoSwaggerClient = <T>() => useCustomClient<T>(baseURL)
