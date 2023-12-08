import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_PDF_CREATOR_TARGET_URL
export const usePdfCreatorSwaggerClient = <T>() => useCustomClient<T>(baseURL)
