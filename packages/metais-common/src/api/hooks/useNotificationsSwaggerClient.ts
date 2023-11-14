import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_NOTIFICATION_ENGINE_TARGET_URL
export const useNotificationsSwaggerClient = <T>() => useCustomClient<T>(baseURL)
