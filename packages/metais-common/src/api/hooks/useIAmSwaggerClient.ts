import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_IAM_REPO_BASE_URL
export const useIAmSwaggerClient = <T>() => useCustomClient<T>(baseURL)
