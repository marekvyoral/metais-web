import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_MONITORING_TARGET_URL
export const useMonitoringSwaggerClient = <T>() => useCustomClient<T>(baseURL)
