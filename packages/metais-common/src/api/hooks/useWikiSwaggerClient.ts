import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_WIKI_BASE_URL
export const useWikiSwaggerClient = <T>() => useCustomClient<T>(baseURL)
