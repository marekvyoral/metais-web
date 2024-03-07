import { UseQueryOptions } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import {
    ApiError,
    RelatedCiTypePreviewList,
    useListRelatedCiTypes as useListRelatedCiTypesSwagger,
} from '@isdd/metais-common/api/generated/types-repo-swagger'

export const useListRelatedCiTypesWrapper = (
    entityName: string,
    options?: { query?: UseQueryOptions<RelatedCiTypePreviewList, ApiError, RelatedCiTypePreviewList> },
    onlyValidProfiles = true,
) => {
    const { data, isLoading, isError, isFetching, refetch, error, isSuccess, fetchStatus } = useListRelatedCiTypesSwagger(entityName, options)
    const [newData, setNewData] = useState<RelatedCiTypePreviewList>()

    useEffect(() => {
        if (!data) {
            return
        }
        if (onlyValidProfiles) {
            setNewData({
                ...data,
                derivedCisAsSources: data.derivedCisAsSources?.map((derivedCi) => ({
                    ...derivedCi,
                    ciType: { ...derivedCi.ciType, attributeProfiles: derivedCi.ciType?.attributeProfiles?.filter((p) => p.valid) },
                    relations: derivedCi.relations?.map((relationshipType) => ({
                        ...relationshipType,
                        attributeProfiles: relationshipType.attributeProfiles?.filter((p) => p.valid),
                        sources: relationshipType.sources?.map((typePreview) => ({
                            ...typePreview,
                            attributeProfiles: typePreview.attributeProfiles?.filter((p) => p.valid),
                        })),
                        targets: relationshipType.targets?.map((typePreview) => ({
                            ...typePreview,
                            attributeProfiles: typePreview.attributeProfiles?.filter((p) => p.valid),
                        })),
                    })),
                })),
                derivedCisAsTargets: data.derivedCisAsTargets?.map((derivedCi) => ({
                    ...derivedCi,
                    ciType: { ...derivedCi.ciType, attributeProfiles: derivedCi.ciType?.attributeProfiles?.filter((p) => p.valid) },
                    relations: derivedCi.relations?.map((relationshipType) => ({
                        ...relationshipType,
                        attributeProfiles: relationshipType.attributeProfiles?.filter((p) => p.valid),
                        sources: relationshipType.sources?.map((typePreview) => ({
                            ...typePreview,
                            attributeProfiles: typePreview.attributeProfiles?.filter((p) => p.valid),
                        })),
                        targets: relationshipType.targets?.map((typePreview) => ({
                            ...typePreview,
                            attributeProfiles: typePreview.attributeProfiles?.filter((p) => p.valid),
                        })),
                    })),
                })),
            })
        } else {
            setNewData(data)
        }
    }, [data, onlyValidProfiles])

    return { data: newData, isLoading, isError, isFetching, refetch, error, isSuccess, fetchStatus }
}
