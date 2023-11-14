import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_CODELIST_REPO_TARGET_URL
export const useCodeListRepoSwaggerClient = <T>() => useCustomClient<T>(baseURL)
