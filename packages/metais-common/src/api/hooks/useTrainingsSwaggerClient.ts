import { useCustomClient } from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_TRAININGS_TARGET_URL
export const useTrainingsSwaggerClient = <T>() => useCustomClient<T>(baseURL)
