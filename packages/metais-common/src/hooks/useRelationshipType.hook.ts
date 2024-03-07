import { UseQueryOptions } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import {
    ApiError,
    RelationshipType,
    useGetRelationshipType as useGetRelationshipTypeSwagger,
} from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useTypesRepoSwaggerClient } from '@isdd/metais-common/api/hooks/useTypesRepoSwaggerClient'

export const useGetRelationshipTypeWrapper = (
    entityName: string,
    options?: { query?: UseQueryOptions<RelationshipType, ApiError, RelationshipType> },
    onlyValidProfiles = true,
) => {
    const { data, isLoading, isError, isFetching, refetch, error, isSuccess, fetchStatus } = useGetRelationshipTypeSwagger(entityName, options)
    const [newData, setNewData] = useState<RelationshipType>()

    useEffect(() => {
        if (!data?.attributeProfiles) {
            return
        }
        if (onlyValidProfiles) {
            setNewData({
                ...data,
                attributeProfiles: data.attributeProfiles.filter((p) => p.valid),
                sources: data.sources?.map((sourceType) => ({
                    ...sourceType,
                    attributeProfiles: sourceType.attributeProfiles?.filter((p) => p.valid),
                })),
                targets: data.targets?.map((targetType) => ({
                    ...targetType,
                    attributeProfiles: targetType.attributeProfiles?.filter((p) => p.valid),
                })),
            })
        } else {
            setNewData(data)
        }
    }, [data, onlyValidProfiles])

    return { data: newData, isLoading, isError, isFetching, refetch, error, isSuccess, fetchStatus }
}

export const useGetRelationshipTypeHookWrapper = (onlyValidProfiles = true) => {
    const getRelationshipType = useTypesRepoSwaggerClient<RelationshipType>()

    return (technicalName: string, signal?: AbortSignal) => {
        return getRelationshipType({ url: `/relationshiptypes/relationshiptype/${technicalName}`, method: 'get', signal }).then(
            (relationshipType) => {
                if (onlyValidProfiles) {
                    return {
                        ...relationshipType,
                        attributeProfiles: relationshipType.attributeProfiles?.filter((p) => p.valid),
                        sources: relationshipType.sources?.map((sourceRelationshipType) => ({
                            ...sourceRelationshipType,
                            attributeProfiles: sourceRelationshipType.attributeProfiles?.filter((p) => p.valid),
                        })),
                        targets: relationshipType.targets?.map((targetRelationshipType) => ({
                            ...targetRelationshipType,
                            attributeProfiles: targetRelationshipType.attributeProfiles?.filter((p) => p.valid),
                        })),
                    }
                }
                return relationshipType
            },
        )
    }
}
