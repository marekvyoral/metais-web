import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_REFERENCE_REGISTERS_TARGET_URL
export const useReferenceRegistersSwaggerClient = <T>() => useCustomClient<T>(baseURL)
