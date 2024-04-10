import { UseQueryOptions } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { useGetCiType as useGetCiTypeSwagger, ApiError, CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useTypesRepoSwaggerClient } from '@isdd/metais-common/api/hooks/useTypesRepoSwaggerClient'

export const useGetCiTypeWrapper = (
    entityName: string,
    options?: { query?: UseQueryOptions<CiType, ApiError, CiType> },
    onlyValidProfiles = true,
) => {
    const { data, isLoading, isError, isFetching, refetch, error, isSuccess, fetchStatus } = useGetCiTypeSwagger(entityName, options)
    const [newData, setNewData] = useState<CiType>()

    useEffect(() => {
        if (!data?.attributeProfiles) {
            return
        }
        if (onlyValidProfiles) {
            setNewData({ ...data, attributeProfiles: data.attributeProfiles.filter((p) => p.valid) })
        } else {
            setNewData(data)
        }
    }, [data, onlyValidProfiles])

    return { data: newData, isLoading, isError, isFetching, refetch, error, isSuccess, fetchStatus }
}

export const useGetCiTypeHookWrapper = (onlyValidProfiles = true) => {
    const getCiType = useTypesRepoSwaggerClient<CiType>()

    return async (technicalName: string, signal?: AbortSignal) => {
        return getCiType({ url: `/citypes/citype/${technicalName}`, method: 'get', signal }).then((ciType) => {
            if (onlyValidProfiles) {
                return { ...ciType, attributeProfiles: ciType.attributeProfiles?.filter((p) => p.valid) }
            }
            return ciType
        })
    }
}
