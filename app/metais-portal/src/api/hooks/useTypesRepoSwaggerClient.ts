import useCustomClient from './use-custom-client'
const baseURL = import.meta.env.VITE_REST_CLIENT_TYPES_REPO_SWAGGER_BASE_URL
export const useTypesRepoSwaggerClient = <T>() => useCustomClient<T>(baseURL)
