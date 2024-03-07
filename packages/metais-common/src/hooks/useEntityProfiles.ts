import { useQueryClient } from '@tanstack/react-query'

import { useGetCiTypeWrapper } from './useCiType.hook'

import {
    AttributeProfile,
    getGetCiTypeQueryKey,
    useGetAttributeOverrides,
    useGetSummarizingCard,
} from '@isdd/metais-common/api/generated/types-repo-swagger'

export const createTabNamesAndValuesMap = (profileAttributes: AttributeProfile[] | undefined) => {
    const keysToDisplay = new Map<string, AttributeProfile | undefined>()
    profileAttributes?.map((attribute) => {
        keysToDisplay.set(attribute?.name ?? '', attribute)
    })
    return keysToDisplay
}

export const useEntityProfiles = (technicalName: string, onlyValidProfiles = true) => {
    const queryClient = useQueryClient()
    const {
        data: ciTypeData,
        isLoading: isCiTypeDataLoading,
        isError: isCiTypeDataError,
        isFetching,
    } = useGetCiTypeWrapper(technicalName, {}, onlyValidProfiles)

    const {
        data: summarizingCardData,
        isLoading: isSummarizingCardLoading,
        isError: isSummarizingCardError,
        refetch: summarizingCardRefetch,
    } = useGetSummarizingCard(technicalName)

    const {
        data: attributesOverridesData,
        isLoading: attributesOverridesLoading,
        isError: attributesOverridesError,
        refetch: attributesOverridesRefetch,
    } = useGetAttributeOverrides(technicalName)

    const refetch = () => {
        const ciTypeDataQueryKey = getGetCiTypeQueryKey(technicalName)
        queryClient.invalidateQueries(ciTypeDataQueryKey)
        summarizingCardRefetch()
        attributesOverridesRefetch()
    }

    const keysToDisplay = createTabNamesAndValuesMap(ciTypeData?.attributeProfiles)
    return {
        isLoading: isCiTypeDataLoading || isSummarizingCardLoading || attributesOverridesLoading || isFetching,
        isError: isCiTypeDataError || isSummarizingCardError || attributesOverridesError,
        ciTypeData,
        summarizingCardData,
        attributesOverridesData,
        keysToDisplay,
        refetch,
    }
}
