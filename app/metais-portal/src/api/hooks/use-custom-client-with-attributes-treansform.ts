import { transformResponseWithAttributesToObject } from './transform'
import { CustomClient } from './use-custom-client'

/**
 * Custom client that transform attributes
 *
 * @template T
 * @param {string} baseURL
 * @param {...string[]} attributesPath all paths from returned data object where attributes array name-value should be converted to object, if there is array in path use `0` to access it
 * @example useCustomClientWithTransform<T>(baseURL, 'configurationItemUi.attributes')
 * // example for nessted attributes object
 * @example useCustomClientWithTransform<T>(baseURL, 'attributes', 'configurationItemUi.attributes')
 * // example for multiple attributes objects
 * @example useCustomClientWithTransform<T>(baseURL, 'ciWithRels.0.ci.attributes')
 * // example for nessted attributes object in array (original path was "ciWithRels[0]ci.attributes")
 * @returns {CustomClient<T>}
 */
export const useCustomClientWithAttributesTransform = <T>(baseURL: string, ...attributesPath: string[]): CustomClient<T> => {
    return async ({ url, method, params, data }) => {
        const searchParams = params ? `?${new URLSearchParams(params)}` : ''
        const response = await fetch(`${baseURL}${url}` + searchParams, {
            headers: {
                method,
                ...data?.headers,
                // accessToken: `Bearer ${accessToken}`,
            },
            ...(data ? { body: JSON.stringify(data) } : {}),
        })

        return transformResponseWithAttributesToObject(await response.json(), attributesPath)
    }
}
