import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_REPORT_TARGET_URL

export const useReportSwaggerClient = <T>() => useCustomClient<T>(baseURL)