import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_NOTIFICATION_MANAGER_TARGET_URL
export const useNotificationManagerSwaggerClient = <T>() => useCustomClient<T>(baseURL)
