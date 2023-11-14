import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_BPM_ENGINE_TARGET_URL
export const useTasksSwaggerClient = <T>() => useCustomClient<T>(baseURL)
