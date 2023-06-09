import { useCustomClientWithAttributesTransform } from './use-custom-client-with-attributes-treansform'

const baseURL = import.meta.env.VITE_REST_CLIENT_CMDB_BASE_URL

export const useCmdbSwaggerClientForReadConfigurationItemUsingGET = <T>() => useCustomClientWithAttributesTransform<T>(baseURL, 'attributes')
export const useCmdbSwaggerClientForGetRoleParticipantUsingGET = <T>() =>
    useCustomClientWithAttributesTransform<T>(baseURL, 'configurationItemUi.attributes')
export const useCmdbSwaggerClientForReadCiNeighboursWithAllRelsUsingGET = <T>() =>
    useCustomClientWithAttributesTransform<T>(baseURL, 'ciWithRels.0.ci.attributes')
